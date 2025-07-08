const UserGroup = require('../models/UserGroup'); 
const roleMiddleware = (...allowedRoles) => {
  return async (req, res, next) => {
    try {

      if (req.user.role === 'system_admin') {
        return next();
      }
      if (allowedRoles.includes(req.user.role)) {
        if (req.user.role === 'group_admin') {
          const managedGroups = await UserGroup.getGroupsByAdmin(req.user.userId);
          if (managedGroups.length === 0) {
            return res.status(403).json({ message: 'Not a manager of any group' });
          }
        }
        return next();
      }

      return res.status(403).json({ message: 'Unauthorized' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
};

module.exports = roleMiddleware;