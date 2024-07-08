import express from 'express'
const router = express.Router()
import { isAdmin,requireSignIn } from '../middlewares/authmiddleware.js';
import {createCategoryController,updateCategoryController,CategoryController,singleCategoryController,deleteCategoryController} from './../controllers/categoryController.js'
//create category
router.post('/create-category',requireSignIn ,isAdmin,createCategoryController)

//update category
router.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController)

//get all
router.get('/get-category',CategoryController)

//single category
router.get('/single-category/:slug',singleCategoryController)

//delete category
router.delete('/delete-category/:id',requireSignIn,isAdmin,deleteCategoryController)

export default router;