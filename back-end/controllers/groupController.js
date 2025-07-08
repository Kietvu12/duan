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

    // Chỉ system admin hoặc group admin của nhóm này mới có quyền thay đổi
    const isRequesterGroupAdmin = await UserGroup.isGroupAdmin(requesterId, groupId);
    if (req.user.role !== 'system_admin' && !isRequesterGroupAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Thực hiện cập nhật trạng thái admin trong nhóm
    await UserGroup.updateAdminStatus(userId, groupId, isGroupAdmin);

    // Kiểm tra xem user có là admin của bất kỳ nhóm nào không
    const userGroups = await UserGroup.getUserGroups(userId);
    const isAdminInAnyGroup = userGroups.some(group => group.is_group_admin);

    // Cập nhật role chính của user
    let newRole = 'user';
    if (isAdminInAnyGroup) {
      newRole = 'group_admin';
    }

    // Nếu role hiện tại khác với role mới thì cập nhật
    const user = await User.findById(userId);
    if (user.role !== newRole) {
      await User.update(userId, { role: newRole });
    }

    // Ghi log
    await AuditLog.create({
      user_id: requesterId,
      action: 'update_group_admin',
      table_affected: 'user_groups',
      record_id: userId,
      new_values: JSON.stringify({ 
        groupId, 
        isGroupAdmin,
        updated_role: newRole 
      })
    });

    res.json({ 
      success: true,
      message: 'Group admin status updated successfully',
      user_role_updated: newRole !== user.role,
      new_role: newRole
    });

  } catch (error) {
    console.error('Error updating group admin status:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};
const getAllGroups = async (req, res) => {
  try {
    let groups;
    const isAccountPage = req.headers['x-request-page'] === 'account-management';

    if (req.user.role === 'system_admin') {
      groups = await Group.getAll();
    } 
    else if (req.user.role === 'group_admin' && isAccountPage) {
      // Chỉ lấy nhóm mà user là admin khi ở trang account management
      groups = await UserGroup.getGroupsByAdmin(req.user.userId);
    }
    else{      
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