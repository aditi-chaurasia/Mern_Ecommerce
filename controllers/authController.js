import User from '../models/usermodel.js';
import orderModel from '../models/orderModel.js'
import { hashPassword, comparePassword } from '../helpers/authHelper.js'
import jwt from 'jsonwebtoken'
import usermodel from '../models/usermodel.js';
export const registercontroller = async(req,res) =>{
    const {name,email,password,phone,address,answer} =req.body
   try{
     // Duplicate user
      let user = await User.findOne({email})
      if(user) return res.json({message:"User already exist",success:false})

     
      // Hash the password
      const hashedPassword = await hashPassword(password);


      //New user
      user=await User.create({name,email,password:hashedPassword,phone,address,answer});
      res.json({message:"Success",user,success:true})
   }
   catch(error){
    res.json({message:error.message})
   }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      // User not found
      let user = await User.findOne({ email });
      if (!user) 
        return res.json({ message: "User not found", success: false });
  
      // Password validation
      const validPassword = await comparePassword(password, user.password);
      if (!validPassword) 
        return res.json({ message: "Invalid credentials", success: false });
      
      // Token generation
      const token = jwt.sign({userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      res.json({ message: `Welcome ${user.name}`, token, success: true,user:{
        _id:user._id,
        name:user.name,
        email:user.email,
        phone:user.phone,
        address:user.address,
        role:user.role
      } });
  
    } catch (error) { 
      res.json({ message: error.message });
    }
  };
  
export const users = async(req,res) =>{
    try{
       let users = await User.find().sort({createdAt:-1});
       res.json(users)
    }
    catch(error){
        res.json({message:error.message})
    }
}

//get profile
export const profile = async(req,res) =>{
  res.json({user:req.user})
}


//forgot password
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    if (!answer) {
      return res.status(400).json({ message: 'Answer is required' });
    }
    if (!newPassword) {
      return res.status(400).json({ message: 'New Password is required' });
    }

    const user = await User.findOne({ email, answer });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Wrong Email or Answer' });
    }

    const hashed = await hashPassword(newPassword);
    await User.findByIdAndUpdate(user._id, { password: hashed });

    return res.status(200).json({ success: true, message: 'Password Reset Successfully' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};


export const updateProfileController = async (req, res) => {
 try {
    const { name, email, password,phone, address } = req.body;
    const user = await usermodel.findById(req.user._id)    
     if(password && password.length<3)
     
      {
        return res.json({ message: 'Password is required' });
      }
      const hashedPassword = password ? await hashPassword(password):undefined
      const updatedUser = await usermodel.findByIdAndUpdate(req.user._id,{
        name:name || user.name,
        password:hashPassword || user.password,
        phone:phone || user.phone,
        address:address || user.address,
      },{new:true})
       res.status(200).send
       ({ message: 'Profile Updated Successfully',
        success:true,
         updatedUser
        });
    }
   catch (error) {
    res.status(400).send({
      success: false,
      message: "Something went wrong",
      error
    })
  }
};

//order
export const getOrderController =async(req,res)=>{
try{
  const orders =await orderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name")
   res.json(orders)
}
catch (error) {
  res.status(500).send({
    success: false,
    message: "Error while getting order",
    error
  })
}
};
