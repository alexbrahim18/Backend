import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


const productCollection = "products"

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum :["Hombre", "mujer", "niño"],
        default:"Hombre"
    },
    status: {
        type: Boolean,
        required: true,
    },
    thumbnail: { 
        type:String,
        required: true
    },
    code: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
});
productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productCollection, productSchema);

export default productModel 