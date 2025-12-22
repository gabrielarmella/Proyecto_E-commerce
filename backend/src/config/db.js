import mongoose from "mongoose";

export const connectDB = async () => {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!uri) {
        console.error("MONGODB_URI no esta definido");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log("Conexion a MongoDB establecida");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
        process.exit(1);
    }
};