import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("☑️conectado a MongoDB");
    } catch (error) {
        console.error("❌Error al conectar a MongoDB:", error);
        process.exit(1);
    }
};
        
