const UserService = require('../services/user.service');

class UserController {
  // [GET] /api/users (chỉ admin)
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers(req.user.role);
      res.json(users);
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }

  // [PUT] /api/users/:id
  static async updateUser(req, res) {
    try {
      const updatedUser = await UserService.updateUser(
        req.params.id,
        req.body,
        req.user.user_id,
        req.user.role
      );
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // [DELETE] /api/users/:id (chỉ admin)
  static async deleteUser(req, res) {
    try {
      await UserService.deleteUser(req.params.id, req.user.role);
      res.json({ message: 'Xóa user thành công' });
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }
}

module.exports = UserController;