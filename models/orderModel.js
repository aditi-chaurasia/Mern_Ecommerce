import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    products :[
        {
            type:mongoose.ObjectId,
            ref:"Product",
        },

    ],
    buyer :{
        type:mongoose.ObjectId,
        ref:"User",
    }, 
    status :{
        type:String,
        enum:["Not Process","pending","shipped","delivered","cancel"],
        default:"Not Process",
    }
})

export default mongoose.model('Order',orderSchema);