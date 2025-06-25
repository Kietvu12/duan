const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { generateToken } = require('../config/jwt');

class AuthService {
  static async login(email, password) {
    // Tìm user bằng email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Email không tồn tại');
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Mật khẩu không chính xác');
    }

    // Kiểm tra tài khoản active
    if (!user.is_active) {
      throw new Error('Tài khoản đã bị vô hiệu hóa');
    }

    // Tạo token
    const token = generateToken({
      user_id: user.user_id,
      email: user.email,
      role: user.role
    });

    // Trả về user (loại bỏ password_hash)
    const userJson = user.toJSON();
    delete userJson.password_hash;

    return {
      user: userJson,
      token
    };
  }
  static async getProfile(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] }
    });
    if (!user) {
      throw new Error('Không tìm thấy người dùng');
    }
    return user;
  }
  static async updateProfile(userId, updateData) {
  const { password_hash, role, user_id, ...allowedUpdates } = updateData;
  const [affectedRows] = await User.update(allowedUpdates, {
    where: { user_id: userId }
  });
  if (affectedRows === 0) {
    throw new Error('Cập nhật thông tin thất bại');
  }
  return await this.getProfile(userId);
}
static async changePassword(userId, currentPassword, newPassword) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('Người dùng không tồn tại');
  }

  // Kiểm tra mật khẩu hiện tại
  const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isMatch) {
    throw new Error('Mật khẩu hiện tại không chính xác');
  }

  // Hash mật khẩu mới
  const newHash = await bcrypt.hash(newPassword, 10);
  
  const [affectedRows] = await User.update(
    { password_hash: newHash },
    { where: { user_id: userId } }
  );
  
  if (affectedRows === 0) {
    throw new Error('Đổi mật khẩu thất bại');
  }
  
  return true;
}
}


module.exports = AuthService;