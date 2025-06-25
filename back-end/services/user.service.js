const User = require('../models/user.model');
const Group = require('../models/group.model');
const UserGroup = require('../models/userGroup.model');
const Transaction = require('../models/transacion.model');
const AuditLog = require('../models/auditlog.model')

class UserService {
  // Lấy danh sách user (cho admin)
  static async getAllUsers(requesterRole) {
    if (requesterRole !== 'system_admin') {
      throw new Error('Chỉ system_admin mới có quyền này');
    }
    return await User.findAll({
      attributes: { exclude: ['password_hash'] }
    });
  }

  // Cập nhật thông tin user
  static async updateUser(userId, updateData, requesterId, requesterRole) {
    // System admin có thể sửa bất kỳ user nào
    if (requesterRole !== 'system_admin' && userId !== requesterId) {
      throw new Error('Bạn chỉ có thể cập nhật thông tin của chính mình');
    }

    const [affectedRows] = await User.update(updateData, {
      where: { user_id: userId },
      fields: ['username', 'zalo_name', 'email'] // Chỉ cho phép cập nhật các trường này
    });

    if (affectedRows === 0) throw new Error('Cập nhật thất bại');
    return await User.findByPk(userId, { attributes: { exclude: ['password_hash'] } });
  }

  // Xóa user (chỉ system_admin)
  static async deleteUser(userId, requesterRole) {
    if (requesterRole !== 'system_admin') {
      throw new Error('Chỉ system_admin mới có quyền xóa user');
    }
    return await User.destroy({ where: { user_id: userId } });
  }
}

module.exports = UserService;