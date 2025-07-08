const bcrypt = require('bcryptjs');
const User = require('../models/User');
const UserGroup = require('../models/UserGroup');
const AuditLog = require('../models/AuditLog');

const getAllUsers = async (req, res) => {
  try {
    // System admin có quyền xem tất cả
    if (req.user.role === 'system_admin') {
      const users = await User.getAll();
      return res.json(users);
    }

    // Group admin chỉ xem được user trong nhóm mình quản lý
    if (req.user.role === 'group_admin') {
      // Lấy tất cả nhóm mà user này là admi
      const managedGroups = await UserGroup.getGroupsByAdmin(req.user.userId);
      
      // Lấy tất cả user từ các nhóm đó
      const groupUsers = await Promise.all(
        managedGroups.map(group => 
          UserGroup.getGroupMembers(group.group_id)
        )
      );
      
      // Gộp và loại bỏ trùng lặp
      const uniqueUsers = [];
      const userIds = new Set();
      
      groupUsers.flat().forEach(user => {
        if (!userIds.has(user.user_id)) {
          userIds.add(user.user_id);
          uniqueUsers.push(user);
        }
      });
      
      return res.json(uniqueUsers);
    }

    // Nếu không phải system_admin hay group_admin
    return res.status(403).json({ message: 'Unauthorized' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only system admin or the user themselves can view the profile
    if (req.user.role !== 'system_admin' && req.user.role !== 'group_admin' && req.user.userId !== user.user_id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const userGroups = await UserGroup.getUserGroups(user.user_id);

    res.json({
      ...user,
      groups: userGroups
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createUser = async (req, res) => {
  try {
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { username, zalo_name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await User.create({
      username,
      zalo_name,
      email,
      password_hash: hashedPassword,
      role
    });

    await AuditLog.create({
      user_id: req.user.userId,
      action: 'create',
      table_affected: 'users',
      record_id: userId,
      new_values: JSON.stringify({ username, email, role })
    });

    res.status(201).json({ message: 'User created successfully', userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Only system admin or the user themselves can update the profile
    if (req.user.role !== 'system_admin' && req.user.userId !== parseInt(userId)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updates = req.body;
    if (updates.password) {
      updates.password_hash = await bcrypt.hash(updates.password, 10);
      delete updates.password;
    }

    await User.update(userId, updates);

    await AuditLog.create({
      user_id: req.user.userId,
      action: 'update',
      table_affected: 'users',
      record_id: userId,
      new_values: JSON.stringify(updates)
    });

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const userId = req.params.id;
    await User.update(userId, { is_active: 0 });

    await AuditLog.create({
      user_id: req.user.userId,
      action: 'delete',
      table_affected: 'users',
      record_id: userId
    });

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};