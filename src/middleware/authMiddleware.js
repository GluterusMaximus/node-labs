import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import tokenService from '../services/tokenService.js';

const protect = asyncHandler(async (req, res, next) => {
  try {
    const { id } = tokenService.parseToken(req);
    const user = await User.findById(id);

    if (!user) throw new Error('User not found');

    next();
  } catch (error) {
    res.status(401);
    next(error);
  }
});

const admin = (req, res, next) => {
  let isAdmin;

  try {
    ({ isAdmin } = tokenService.parseToken(req));
  } catch (error) {
    res.status(401);
    next(error);
  }

  if (isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };
