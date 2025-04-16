import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const saltRounds = 10;

export const registerUser = async (userData) => {
  const { name, email, password, role } = userData;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw { status: 400, message: 'User already exists' };
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = new User({
    name,
    email,
    password: hashedPassword,
    role,
  });
  await user.save();
  return user;
};

export const loginUser = async (loginData) => {
  const { email, password } = loginData;
  const user = await User.findOne({ email });
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw { status: 401, message: 'Incorrect password' };
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  return { token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } };
};

export const createAdminUser = async (userData) => {
  const { name, email, password, role } = userData;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw { status: 400, message: 'User already exists' };
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = new User({
    name,
    email,
    password: hashedPassword,
    role,
  });
  await user.save();
  return user;
};

export const getAllUsers = async (query) => {
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'asc', search, role, enabled } = query;

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  if (role) {
    filter.role = role;
  }

  if (enabled !== undefined) {
    filter.enabled = enabled === 'true';
  }

  const users = await User.find(filter).sort(sort).skip(skip).limit(limit);
  const totalUsers = await User.countDocuments(filter);
  return {
    users,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalUsers / limit),
    totalUsers,
  };
};

export const changeUserRole = async (userId, role) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw { status: 400, message: 'Invalid user ID' };
  }
  const user = await User.findById(userId);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }
  user.role = role;
  await user.save();
  return user;
};

export const changeUserStatus = async (userId, status) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw { status: 400, message: 'Invalid user ID' };
  }
  const user = await User.findById(userId);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }
  user.enabled = status;
  await user.save();
  return user;
};

export const deleteUser = async (userId) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw { status: 400, message: 'Invalid user ID' };
  }
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }
  return user;
};