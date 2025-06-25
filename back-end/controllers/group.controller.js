const GroupService = require('../services/group.service');

class GroupController {
  static async createGroup(req, res) {
    try {
      const { group_name } = req.body;
      const newGroup = await GroupService.createGroup(
        { group_name },
        req.user.user_id
      );
      res.status(201).json(newGroup);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async addMember(req, res) {
    try {
      const { groupId } = req.params;
      const { userId, isAdmin } = req.body;
      
      const result = await GroupService.addMember(
        groupId,
        userId,
        isAdmin,
        req.user.user_id
      );
      
      res.status(201).json(result);
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }

  static async getGroupDetails(req, res) {
    try {
      const { groupId } = req.params;
      const result = await GroupService.getGroupDetails(groupId, req.user.user_id);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = GroupController;