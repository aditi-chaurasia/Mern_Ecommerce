import slugify from 'slugify';
import productModel from '../models/productmodel.js';
import categoryModel from '../models/categorymodel.js'
import fs from 'fs'
import braintree from 'braintree';
import orderModel from '../models/orderModel.js';

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "ws83czpzkg22b47s",
  publicKey: "kv4bh7xtg47mx6yv",
  privateKey: "be0973af41af6919f2cfdf7c64d8394c",
});

//add product
export const createProductController = async(req,res) =>{
    try{
      const {name,slug,description,price,category,quantity,shipping} = req.fields;
      const {Photo}=req.files

      //validation
      switch (true) {

        case !name:
        
        return res.status(500).send({ error: "Name is Required" });
        
        case !description:
        
        return res.status(500).send({ error: "Description is Required" });
        
        case !price:
        
        return res.status(500).send({ error: "Price is Required" });
        
        case !category:
        
        return res.status(500).send({ error: "Category is Required" });
        
        case !quantity:
        
        return res.status(500).send({ error: "Quantity is Required" });
        
        case Photo && Photo.size > 1000000:
        
        return res
        
        .status(500)
        
        .send({ error: "photo is Required and should be less then 1mb" });
     }
     const products=new productModel({...req.fields, slug: slugify(name) });

     if (Photo) {
      products.Photo.data =fs.readFileSync(Photo.path);
     
      products.Photo.contentType= Photo.type;
     }
     
     await products.save(); 
     res.status(201).send({
     success: true,
     message: "Product Created Successfully",
     products,
     });
    }
    catch(error){
      console.log(error)
      res.status(500).send({
          success:false,
          error,
          message:"Error in creating product"
      })
    }
};

//get product
export const getProductController =  async(req,res) =>{
    try{
      const products =await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1});
      res.status(200).send({
      success: true,
      countTotal:products.length,
      message: "AllProducts",
      products,
     
    });
      
    }
    catch(error){
      console.log(error)
      res.status(500).send({
          success:false,
          error,
          message:"Error in getting product"
      })
    }
  
};

export const getsingleProductController =  async(req,res) =>{
  try{
    const product =await productModel.findOne({slug:req.params.slug}).select("-photo").populate ("category")
    res.status(200).send({
    success:true,
    message: 'Single Product Fetched',
   product,
})

  }
  catch(error){
  res.status(500).send({
    success:false,
    error,
    message:"Error in getting single product"
})
}
};


//get photo
export const productPhotoController = async(req,res) =>{
  try{
    const product =await productModel.findById(req.params.pid).select("-photo")
    if(product.Photo.data)
    {
      res.set("Content-type",product.Photo.contentType);
      return res.status(200).send(product.Photo.data)
    }
  }
  catch(error){
    res.status(500).send({
      success:false,
      error,
      message:"Error in product photo"
    })  
  }
}

//delete product
export const deleteProductController=async(req,res)=>{
  try{
    await productModel.findByIdAndDelete(req.params.pid).select("-photo")
    res.status(200).send({
      success:true,
      message:"Product deleted succesfully"
    })
  }
  catch(error){
    res.status(500).send({
      success:false,
      error,
      message:"Error while deleting product"
    }) 
  }

} 


//update product
export const updateProductController = async(req,res) =>{
  try{
    const {name,description,price,category,quantity,shipping} = req.fields;
    const {Photo}=req.files

    //validation
    switch (true) {

      case !name:
      
      return res.status(500).send({ error: "Name is Required" });
      
      case !description:
      
      return res.status(500).send({ error: "Description is Required" });
      
      case !price:
      
      return res.status(500).send({ error: "Price is Required" });
      
      case !category:
      
      return res.status(500).send({ error: "Category is Required" });
      
      case !quantity:
      
      return res.status(500).send({ error: "Quantity is Required" });
      
      case Photo && Photo.size > 1000000:
      
      return res
      
      .status(500)
      
      .send({ error: "photo is Required and should be less then 1mb" });
   }
   const products=await productModel.findByIdAndUpdate(req.params.pid,
    {...req.fields,slug:slugify(name)},{new:true}
   )
   if (Photo) {
    products.Photo.data =fs.readFileSync(Photo.path);
   
    products.Photo.contentType= Photo.type;
   }
   
   await products.save(); 
   res.status(201).send({
   success: true,
   message: "Product updated Successfully",
   products,
   });
  }
  catch(error){
    console.log(error)
    res.status(500).send({
        success:false,
        error,
        message:"Error in updating product"
    })
  }
};

// filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

// product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 2;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};


//search product
export const searchProductController = async (req, res) => {
  try{
    const {keyword} =req.params
    const results = await productModel.find({
      $or:[
        {name:{$regex:keyword,$options:'i'}},
        {description:{$regex:keyword,$options:'i'}}
      ]
    }).select("-photo");
    res.json(results);
  }
  catch(error)
  {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in search product",
      error,
    });
  }
}

export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel.find({
      category: cid,
      _id: { $ne: pid },
    })
    .select("-photo")
    .limit(3)
    .populate("category");

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while getting related products",
      error,
    });
  }
};

//get producy by category
export const productCategoryController = async(req,res) =>{
  try{
   const category = await categoryModel.findOne({slug:req.params.slug})
   const products = await productModel.find({category:category._id}).populate('category')
   res.status(200).send({
    success:true,
    category,
    products
   })

  }
  catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while getting products",
      error,
    });
  }
};

export const braintreeTokenController =() =>{
  try{
    gateway.clientToken.generate({},function(err,response){
      if(err)
      {
        res.status(500).send(err);
      }
      else{
        res.send(response);
      }
    })
  }
  catch(error)
  {
    console.log(error)
  }
}

export const braintreePaymentController= async(req,res)=>{
  try{
    const {cart,nonce} =req.body;
    let total = 0;
    cart.map((i)=>{
      total+=i.price;
    });
    let newTransaction= gateway.transaction.sale({
      amount:total,
      paymentMethodNonce:nonce,
      options: {
        submitForSettlement: true
      }
    }
  ,function(error,result){
    if(result){
      const order = new orderModel({
        products:cart,
        payment:result,
        buyer:req.user._id,
      }).save()
      res.json({ok:true})
    }
    else{
      res.status(200).send(error)
    }
  }
)}
  catch(error){
    console.log(error)
  }

}