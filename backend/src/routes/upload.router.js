import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { authMiddleware, adminOnly } from "../middlewares/auth.middleware.js";

const router = Router();

const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // carpeta donde se guardan las imágenes
    cb(null, path.join(__dirName, "..", "..", "uploads", "products"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // .jpg, .png, etc.
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  // aceptar solo imágenes
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Solo se permiten imágenes"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 7 * 1920 * 1080 }, // 5 MB
});

// POST /api/upload/products
router.post("/products", authMiddleware, adminOnly, upload.fields([{ name:"image", maxCount: 1}, { name:"images", maxCount:  10}]), (req, res) => {
  const uploaded = [
    ... (req.files?.image || []),
    ... (req.files?.images || []),
  ];
  if (!uploaded.length){
    return res.status(400).json({ success: false, message: "No se subió ninguna imagen" });
  }
  const images = uploaded.map((file) => ({
    url: `/uploads/products/${file.filename}`,
    fileName: file.filename,
  }));
  res.status(201).json({
    success: true,
    images,
    url: images[0].url,
    fileName: images[0].fileName,
  });
});

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success:false, message: err.message });
  }
  if (err) {
    return res.status(500).json({ success:false, message: err.message });
  }
  next();
});

export default router;
