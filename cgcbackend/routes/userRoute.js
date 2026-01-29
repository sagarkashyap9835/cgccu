// import express from 'express';
// import { registerUser,loginUser,getProfile,updateProfile } from '../controllers/userController.js';
// import authUser from '../middlewares/authUser.js';
// import upload from '../middlewares/multer.js';
// const userRouter = express.Router();

// userRouter.post('/register', registerUser);
// userRouter.post('/login', loginUser);
// userRouter.get('/get-profile',authUser,getProfile);
// userRouter.post('/update-profile',upload.single('image'),authUser, updateProfile);
// export default userRouter;


import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile, googleLogin, becomeOwner } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/google-login', googleLogin); // Naya Route
userRouter.get('/get-profile', authUser, getProfile);
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile);
userRouter.post('/become-owner', authUser, becomeOwner);

export default userRouter;