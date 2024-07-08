import express from 'express';
import { addToCart, clearCart, removeProductFromCart, userCart,decreaseProductQty } from '../controllers/cartController.js';
import { requireSignIn } from "../middlewares/authmiddleware.js";

const router = express.Router();
//requireSignIn--->sbse phele yhi run hoga then next function

//add to cart
router.post('/add',requireSignIn,addToCart)

//get user cart
router.get('/user',requireSignIn,userCart)

//remove product from cart
router.delete('/remove/:productId',requireSignIn,removeProductFromCart)

//clear cart 
router.delete('/clear',requireSignIn,clearCart)

//decrease item qty
router.post('/decraese_qty',requireSignIn,decreaseProductQty)

export default router;
