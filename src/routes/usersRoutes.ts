import express from 'express';
import {
  register,
  getAllUsers,
  getOneUser,
  login,
  logout,
} from '../controllers/users.controllers';

const userRouter = express.Router();

userRouter.get('/', getAllUsers);
userRouter.get('/:userId', getOneUser);
userRouter.post('/register', register);
userRouter.post('/login', login);
// userRouter.post('/register', register);
userRouter.post('/logout', logout);

export default userRouter;
