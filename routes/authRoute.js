import express from 'express';
import { login, profile, registercontroller, users,
    forgotPasswordController,updateProfileController,getOrderController } from '../controllers/authController.js';
import { requireSignIn, isAdmin } from "../middlewares/authmiddleware.js";
const router = express.Router();

//register user
router.post('/register', registercontroller); //======/api/user/register

//login user
router.post('/login', login);


//get all users
router.get('/all',requireSignIn,isAdmin,users);


//get user profile
router.get('/profile',requireSignIn,profile)


//protected route for user
router.get('/user-auth',requireSignIn, (req, res) => {
    res.send({ ok: true });
});

//protected route for admin
router.get('/admin-auth',requireSignIn,isAdmin,(req, res) => {
    res.send({ ok: true });
});

//forgot password
router.post('/forgot-password',forgotPasswordController)

//update profile
router.put('/profile',requireSignIn, updateProfileController)

//orders
router.get('/orders',requireSignIn,getOrderController)
export default router;


