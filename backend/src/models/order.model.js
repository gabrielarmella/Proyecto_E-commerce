import mongoose from "mongoose";
import { type } from "node:os";

const orderItemSchema = new mongoose.Schema(
    {
        product: {type: mongoose.Schema.Types.ObjectId,ref: "Product",required: true},
        quantity: {type: Number,required: true,min: 1},
        price: {type: Number,required: true,min: 0},
    },
    {_id: false }
);

const addressSchema = new mongoose.Schema(
    {
        calle: String,
        ciudad: String,
        provincia: String,
        codigoPostal: String,
        pais:{type: String, default: "Argentina"},
    },
    {_id: false}
);
const orderSchema = new mongoose.Schema(
    {
        user: {type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},
        items: {type: [orderItemSchema], default: []},
        total: {type: Number, required: true, min: 0},
        status: {
            type: String,
            enum: ["pendiente", "enviado", "entregado", "cancelado"],
            default: "pendiente",
        },
        mediosPago: {
            type: String,
            enum: ["tarjeta", "mercadoPago", "transferencia"],
            default: "mercadoPago",
        },
        estatusPago: {
            type: String,
            enum: ["pendiente", "completado", "fallido"],
            default: "pendiente",
        },
        direccionEnvio: addressSchema,
        ticket: {
            type: String,
            default: () => `T-${Date.now()}`,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);  

const Order = mongoose.model("Order", orderSchema);

export default Order;