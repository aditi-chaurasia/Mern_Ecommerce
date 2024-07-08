import express from 'express';
import { addAddress , getAddress} from '../controllers/addressController.js'; // Ensure the path is correct
import { requireSignIn } from "../middlewares/authmiddleware.js";

const router = express.Router();

// add address
router.post("/add", requireSignIn,addAddress);

// get first address only
router.get('/get',requireSignIn, getAddress)

export default router;
