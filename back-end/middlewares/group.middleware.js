const UserGroup = require('../models/userGroup.model');

const checkGroupPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const { groupId } = req.params;
      const { user_id, role } = req.user;

      // System admin có toàn quyền
      if (role === 'system_admin') return next();

      // Kiểm tra user có trong nhóm không
      const userGroup = await UserGroup.findOne({
        where: { user_id, group_id: groupId }
      });

      if (!userGroup) {
        return res.status(403).json({ error: 'Bạn không thuộc nhóm này' });
      }

      // Kiểm tra quyền cụ thể
      switch(requiredPermission) {
        case 'view_transactions':
          if (role === 'group_admin' || role === 'user') return next();
          break;
        case 'create_transaction':
          if (role === 'group_admin') return next();
          if (role === 'user' && req.body.user_id === user_id) return next();
          break;
        case 'manage_members':
          if (role === 'group_admin' && userGroup.is_group_admin) return next();
          break;
        default:
          return res.status(403).json({ error: 'Không có quyền thực hiện hành động này' });
      }

      return res.status(403).json({ error: 'Không đủ quyền thực hiện' });
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({ error: 'Lỗi kiểm tra quyền' });
    }
  };
};

module.exports = checkGroupPermission;