import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {type: String, required: true, trim: true},
        price: {type: Number, required: true, min: 0},
        description: {type: String, default: ""},
        stock: {type: Number, default: 0, min: 0},
        category: {type: String,default: "general", index: true},
        brand: {type: String, default: ""},
        images: {type: [String], default: []},
        isFeatured: {
            type: Boolean, 
            default: false
        },
        tags: {
            type: [String],
            default: [],
            index: true,
        },
        active: {
            type: Boolean,
            default: true,
        }, 
    },
    {
        timestamps: true,
    }
);  

const Product = mongoose.model("Product", productSchema);

export default Product;