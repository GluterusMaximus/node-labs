import tokenService from '../services/tokenService.js';
import userService from '../services/userService.js';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';

// @desc     Auth user & get token
// @route    POST /api/users/login
// @access   Public
const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userData = await userService.login(email, password);
    res.json(userData);
  } catch (error) {
    res.status(401);
    next(error);
  }
});

// @desc     Register a new user
// @route    POST /api/users
// @access   Public
const registerUser = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw { message: 'Invalid registration data', errors: errors.array() };
  }

  try {
    const { email, name, password } = req.body;

    const userData = await userService.register(email, name, password);
    res.json(userData);
  } catch (error) {
    res.status(400);
    next(error);
  }
});

// @desc     Get user profile
// @route    GET /api/users/profile
// @access   Private
const getUserProfile = asyncHandler(async (req, res, next) => {
  try {
    const { id } = tokenService.parseToken(req);
    const userData = await userService.get(id);

    res.json(userData);
  } catch (error) {
    res.status(404);
    next(error);
  }
});

// @desc     Update user profile
// @route    PUT /api/users/profile
// @access   Private
const updateUserProfile = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw { message: 'Invalid update data', errors: errors.array() };
  }

  try {
    const { id } = tokenService.parseToken(req);
    const { name, email, password } = req.body;

    const updatedData = await userService.updateUser(id, {
      name,
      email,
      password,
    });
    res.json(updatedData);
  } catch (error) {
    res.status(404);
    next(error);
  }
});

// @desc     Get all users
// @route    GET /api/users
// @access   Private/Admin
const getUsers = asyncHandler(async (req, res, next) => {
  try {
    const usersData = await userService.getAll();
    res.json(usersData);
  } catch (error) {
    res.status(404);
    next(error);
  }
});

// @desc     Delete a user
// @route    DELETE /api/users/:id
// @access   Private/Admin
const deleteUser = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    await userService.delete(id);
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(404);
    next(error);
  }
});

// @desc     Get a user by id
// @route    GET /api/users/:id
// @access   Private/Admin
const getUserById = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const userData = await userService.get(id);
    res.json(userData);
  } catch (error) {
    res.status(404);
    next(error);
  }
});

// @desc     Update user profile
// @route    PUT /api/users/:id
// @access   Private/Admin
const updateUser = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw { message: 'Invalid update data', errors: errors.array() };
  }

  try {
    const id = req.params.id;
    const { name, email, password, isAdmin } = req.body;

    const updatedData = await userService.updateUser(id, {
      name,
      email,
      password,
      isAdmin,
    });
    res.json(updatedData);
  } catch (error) {
    res.status(404);
    next(error);
  }
});

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
