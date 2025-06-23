const GroupService = require('../services/group.service');
const { authorize } = require('../middlewares/auth.middleware');

class GroupController {
  static async getAllGroups(req, res) {
    try {
      // Sử dụng middleware authorize thay vì kiểm tra thủ công
      const groups = await GroupService.getAllGroups();
      res.json(groups);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getGroupMembersWithTransactions(req, res) {
    try {
      const { groupId } = req.params;
      const userId = req.user.user_id;

      const result = await GroupService.getGroupMembersWithTransactions(groupId, userId, req.user.role);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = GroupController;