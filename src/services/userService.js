import tokenService from './tokenService.js';
import User from '../models/userModel.js';
import UserDto from '../dtos/userDto.js';
import { USER_NOT_FOUND_MESSAGE } from '../constants/errorConstants.js';

class UserService {
  async register(email, name, password) {
    const userExists = await User.findOne({ email });
    if (userExists) throw new Error('User already exists');

    const user = await User.create({ name, email, password });
    if (!user) throw new Error('Invalid user data');

    const userDto = new UserDto(user);
    const token = tokenService.generateToken({
      id: user._id,
      isAdmin: user.isAdmin,
    });
    return {
      ...userDto,
      token,
    };
  }

  async login(email, password) {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      throw new Error('Invalid email or password');
    }
    const userDto = new UserDto(user);
    const token = tokenService.generateToken({
      id: user._id,
      isAdmin: user.isAdmin,
    });

    return {
      ...userDto,
      token,
    };
  }

  async updateUser(id, updatedData) {
    const user = await User.findById(id);
    if (!user) throw new Error(USER_NOT_FOUND_MESSAGE);

    user.name = updatedData.name;
    user.email = updatedData.email;
    user.password = updatedData.password;
    user.isAdmin = updatedData.isAdmin ?? false;

    const updatedUser = await user.save();

    const userDto = new UserDto(updatedUser);
    const token = tokenService.generateToken({
      id: updatedUser._id,
      isAdmin: updatedUser.isAdmin,
    });

    return {
      ...userDto,
      token,
    };
  }

  async getAll() {
    const users = await User.find({});
    return users.map(user => new UserDto(user));
  }

  async delete(id) {
    const user = await User.findById(id);
    if (!user) throw new Error(USER_NOT_FOUND_MESSAGE);

    return await user.remove();
  }

  async get(id) {
    const user = await User.findById(id);

    if (!user) throw new Error(USER_NOT_FOUND_MESSAGE);

    return new UserDto(user);
  }
}

export default new UserService();
