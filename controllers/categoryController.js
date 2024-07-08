import categorymodel from '../models/categorymodel.js'
import slugify from 'slugify';
export  const createCategoryController =async(req,res) =>{
try{
    const {name} = req.body;
    if(!name){
        return res.status(401).send({message:"Name required"})
    }
    const existingCategory= await categorymodel.findOne({name});
    if(existingCategory)
    {
        return res.status(200).send({
            success:true,
            message:"Category already exist"
        })
    }
    const category = await new categorymodel({name,slug:slugify(name)}).save()
    res.status(201).send({
         success:true,
        message:"New category created",
        category,
    })
}
catch(error){
    console.log(error)
    res.status(500).send({
        success:false,
        message:"Error in Category",
        error,
    })
}
}

//update category
export const updateCategoryController = async(req,res) =>{
    try{ 
         const {name}=req.body
         const {id} = req.params
         const category = await categorymodel.findByIdAndUpdate(
         id,
        {name,slug:slugify(name)},
        {new:true}
         );
         res.status(200).send({
            success:true,
            message:"Category updated successfully",
            category,
         });
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while updating Category"}),
            error
    }
};

//get all category
export const CategoryController = async(req,res) =>{
 try{
     const category = await categorymodel.find({})
    res.status(200).send({
        success:true,
            message:"All category list",
            category,
    })
 }
 catch(error){
 console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while getting all Category"}),
            error
    }

}

//singleCategoryController
export const singleCategoryController = async(req,res) =>{
    try{
        const category=await categorymodel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            message:'Get Single Category Successfully',
            category,
        })
    }
    catch(error)
    {   
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while getting all Category"}),
            error
    }
    
}

//deletecontroller
export const deleteCategoryController= async(req,res)=>{
    try {
        const { id } = req.params;
        await categorymodel.findByIdAndDelete(id);
        res.status(200).send({
          success: true,
          message: "Categry Deleted Successfully",
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "error while deleting category",
          error,
        });
      }
    };