import express from 'express';
import {createProductController,getProductController,getsingleProductController,
productPhotoController,deleteProductController,updateProductController,
productCountController,productListController,productFiltersController,
searchProductController,relatedProductController,productCategoryController,
braintreeTokenController,braintreePaymentController} from '../controllers/productCantroller.js';
import { requireSignIn,isAdmin } from '../middlewares/authmiddleware.js';
import formidable from 'express-formidable';
import braintree from 'braintree';
const router = express.Router();

//add product
router.post('/create-product', requireSignIn,isAdmin,formidable(),createProductController);

//get product
router.get('/get-product',getProductController)

//single product
router.get('/get-product/:slug',getsingleProductController)

//get photo
router.get('/product-photo/:pid',productPhotoController)

//delete product
router.delete('/delete-product/:pid',deleteProductController)

router.put('/update-product/:pid', requireSignIn,isAdmin,formidable(),updateProductController);

//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword",searchProductController)

//similar product
router.get("/related-product/:pid/:cid",relatedProductController)

//category wise
router.get("/product-category/:slug",productCategoryController)

//token
router.get('/braintree/token',braintreeTokenController)

router.post('/braintree/payment',requireSignIn,braintreePaymentController)
export default router;
