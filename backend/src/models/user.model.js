import mongoose from "mongoose";

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

const userSchema = new mongoose.Schema(
    {
        name: {type: String,required: true,trim: true},
        email: {type: String,required: true,unique: true,lowercase: true,trim: true},
        passwordHash: {type: String,required: true},
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        phone: {type: String,default: ""},
        direccionEnvios: addressSchema,
        direccionFacturacion: addressSchema,
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;

