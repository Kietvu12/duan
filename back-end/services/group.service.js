const User = require('../models/user.model');
const Group = require('../models/group.model');
const UserGroup = require('../models/userGroup.model');
const Transaction = require('../models/transacion.model');
const AuditLog = require('../models/auditlog.model')

class GroupService {
  static async createGroup(groupData, creatorId) {
    const transaction = await sequelize.transaction();
    try {
      // Tạo nhóm mới
      const newGroup = await Group.create({
        group_name: groupData.group_name,
        created_by: creatorId
      }, { transaction });

      // Thêm người tạo vào nhóm với quyền admin
      await UserGroup.create({
        user_id: creatorId,
        group_id: newGroup.group_id,
        is_group_admin: true
      }, { transaction });

      await transaction.commit();
      return newGroup;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async addMember(groupId, userId, isAdmin = false, requesterId) {
    // Kiểm tra người thêm có phải admin nhóm không
    const requesterInGroup = await UserGroup.findOne({
      where: { user_id: requesterId, group_id: groupId, is_group_admin: true }
    });

    if (!requesterInGroup) {
      throw new Error('Chỉ admin nhóm mới có thể thêm thành viên');
    }

    return await UserGroup.create({
      user_id: userId,
      group_id: groupId,
      is_group_admin: isAdmin
    });
  }

  static async getGroupDetails(groupId, userId) {
    const group = await Group.findByPk(groupId);
    if (!group) throw new Error('Nhóm không tồn tại');

    const members = await User.findAll({
      include: [{
        model: UserGroup,
        where: { group_id: groupId },
        attributes: ['is_group_admin', 'joined_at']
      }],
      order: [
        [UserGroup, 'is_group_admin', 'DESC'],
        ['username', 'ASC']
      ]
    });

    return { group, members };
  }
static async getAllGroups(requesterId, requesterRole) {
  // Tạo options cơ bản
  const options = {
    include: [
      {
        model: User,
        as: 'creator',
        attributes: ['user_id', 'username', 'email']
      }
    ],
    order: [['created_at', 'DESC']]
  };

  // Nếu không phải system_admin, thêm điều kiện where
  if (requesterRole !== 'system_admin') {
    options.include.push({
      model: UserGroup,
      as: 'userGroupRelations',
      where: { user_id: requesterId },
      attributes: [], // Không lấy thông tin từ bảng user_groups
      required: true // Bắt buộc phải có trong nhóm
    });
  }

  return await Group.findAll(options);
}
}

module.exports = GroupService;