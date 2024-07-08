import mongoose from "mongoose";

const cartItemSchema= new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId, //user ki id milegi isse
        ref:'Product',
        required:true
    },
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    qty:{
        type:Number,
        required:true
    },
    imgSrc:{
        type:String,
        required:true
    }
});

const cartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId, //user ki id milegi isse
        ref:'User',
        required:true
    },
    items:[cartItemSchema]
});

export default mongoose.model('Cart', cartSchema);