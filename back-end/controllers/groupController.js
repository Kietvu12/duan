const Group = require('../models/Group');
const UserGroup = require('../models/UserGroup');
const AuditLog = require('../models/AuditLog');

const createGroup = async (req, res) => {
  try {
    const { group_name } = req.body;
    const created_by = req.user.userId;

    const groupId = await Group.create({ group_name, created_by });

    // Add creator as group admin
    await UserGroup.addUserToGroup(created_by, groupId, true);

    await AuditLog.create({
      user_id: created_by,
      action: 'create',
      table_affected: 'groups',
      record_id: groupId,
      new_values: JSON.stringify({ group_name })
    });

    res.status(201).json({ message: 'Group created successfully', groupId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getGroupById = async (req, res) => {
  try {
    const groupId = req.params.id;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is in the group or is system admin
    const isInGroup = await UserGroup.isUserInGroup(req.user.userId, groupId);
    if (req.user.role !== 'system_admin' && !isInGroup) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const members = await UserGroup.getGroupMembers(groupId);
    res.json({ ...group, members });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addUserToGroup = async (req, res) => {
  try {
    const { groupId, userId, isGroupAdmin } = req.body;
    const requesterId = req.user.userId;

    // Check if requester is system admin or group admin
    const isRequesterGroupAdmin = await UserGroup.isGroupAdmin(requesterId, groupId);
    if (req.user.role !== 'system_admin' && !isRequesterGroupAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const userGroupId = await UserGroup.addUserToGroup(userId, groupId, isGroupAdmin);

    await AuditLog.create({
      user_id: requesterId,
      action: 'add_user_to_group',
      table_affected: 'user_groups',
      record_id: userGroupId,
      new_values: JSON.stringify({ groupId, userId, isGroupAdmin })
    });

    res.status(201).json({ message: 'User added to group successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeUserFromGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const requesterId = req.user.userId;

    // Check if requester is system admin or group admin
    const isRequesterGroupAdmin = await UserGroup.isGroupAdmin(requesterId, groupId);
    if (req.user.role !== 'system_admin' && !isRequesterGroupAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Can't remove yourself if you're the only admin
    if (userId === requesterId) {
      const groupAdmins = (await UserGroup.getGroupMembers(groupId))
        .filter(member => member.is_group_admin);
      
      if (groupAdmins.length === 1) {
        return res.status(400).json({ message: 'Cannot remove the only group admin' });
      }
    }

    await UserGroup.removeUserFromGroup(userId, groupId);

    await AuditLog.create({
      user_id: requesterId,
      action: 'remove_user_from_group',
      table_affected: 'user_groups',
      record_id: userId,
      old_values: JSON.stringify({ groupId })
    });

    res.json({ message: 'User removed from group successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateGroupAdminStatus = async (req, res) => {
  try {
    const { groupId, userId, isGroupAdmin } = req.body;
    const requesterId = req.user.userId;

    // Only system admin or group admin can change admin status
    const isRequesterGroupAdmin = await UserGroup.isGroupAdmin(requesterId, groupId);
    if (req.user.role !== 'system_admin' && !isRequesterGroupAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await UserGroup.updateAdminStatus(userId, groupId, isGroupAdmin);

    await AuditLog.create({
      user_id: requesterId,
      action: 'update_group_admin',
      table_affected: 'user_groups',
      record_id: userId,
      new_values: JSON.stringify({ groupId, isGroupAdmin })
    });

    res.json({ message: 'Group admin status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
const getAllGroups = async (req, res) => {
  try {
    let groups;
    
    if (req.user.role === 'system_admin') {
      // System admin can see all groups
      groups = await Group.getAll();
    } else {
      // Regular users can only see groups they belong to
      groups = await UserGroup.getUserGroups(req.user.userId);
    }

    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createGroup,
  getGroupById,
  addUserToGroup,
  removeUserFromGroup,
  updateGroupAdminStatus,
  getAllGroups
};