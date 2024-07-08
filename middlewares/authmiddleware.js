import jwt from 'jsonwebtoken';
import User from '../models/usermodel.js'

export const requireSignIn = async (req, res, next) => {
  const token = req.header("Auth");

  if (!token) return res.json({ message: "Login first" });

  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.userId
    let user = await User.findById(id)
    if(!user) return res.json({message:"User not found"})
     
    req.user = user;  
    next(); 
  
};


//user access
export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access: No user data" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized access: Admins only",
      });
    } else {
      next();
    }
  } catch (error) {
    console.error('Error in isAdmin middleware:', error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error in admin middleware",
    });
  }
};
