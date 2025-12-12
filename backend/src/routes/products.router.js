import { Router } from "express";
import Product from "../models/product.model.js";
import { authMiddleware, adminOnly } from "../middlewares/auth.middleware.js";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestión de productos del e-commerce
 */

    // GET /api/products/:id - Obtener un producto por ID
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({success: false, message: "Producto no encontrado"});
        }
        res.json({success: true, data: product});
    } catch (error) {
        res.status(400).json({success: false, message: "ID de producto inválido"});
    }
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener lista de productos
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Texto para buscar en nombre, descripción o tags
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoría
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Precio mínimo
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Precio máximo
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de items por página
 *     responses:
 *       200:
 *         description: Lista de productos
 */
//GET sin authentication
router.get("/", async (req, res) => {
    try {
        const {
            search,
            category,
            minPrice,
            maxPrice,
            page = 1,
            limit = 10,
            sort 
        } = req.query;
        const filter = {active: true};

        if (category){
            filter.category = category;
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number (minPrice);
            if (maxPrice) filter.price.$lte = Number (maxPrice);
        }
        if (search) {
            filter.$or = [
                {name: {$regex: search, $options: "i"}},
                {description: {$regex: search, $options: "i"}},
                {tags: { $elemMatch: {$regex: search, $options: "i"}}},
            ];
        }
        const pageNm = Number(page) || 1;
        const limitNm = Number(limit) || 10;
        const skip = (pageNm - 1) * limitNm;

        let sortOption = { createdAt: -1 };
        if (sort === "priceAsc") sortOption = { price: 1 };
        if (sort === "priceDesc") sortOption = { price: -1 };
        if (sort === "nameAsc") sortOption = { name: 1 };
        if (sort === "nameDesc") sortOption = { name: -1 };

        const [products, total] = await Promise.all([
            Product.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNm),
            Product.countDocuments(filter),
        ]);

        res.json({
            success: true,
            data: products,
            pagination: {
                total,
                page: pageNm,
                limit: limitNm,
                pages: Math.ceil(total / limitNm),
            },
        });
    } catch (error) {
        console.log("Error en GET /api/products:", error);
        res.status(500).json({ success: false, message: "Error al obtener los productos" });
    }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Cámara IP Hikvision
 *               price:
 *                 type: number
 *                 example: 120
 *               description:
 *                 type: string
 *                 example: Cámara IP 1080p para exteriores
 *               stock:
 *                 type: integer
 *                 example: 10
 *               category:
 *                 type: string
 *                 example: seguridad
 *     responses:
 *       201:
 *         description: Producto creado
 *       401:
 *         description: No autorizado (token faltante o inválido)
 *       403:
 *         description: Solo administradores pueden crear productos
 */
//POST /api/products - Solo admin
router.post("/", authMiddleware, adminOnly, async (req, res) => {
    try {
        const {
            name,
            price,
            description,
            stock,
            category,
            brand, 
            images,
            isFeatured,
            tags,
        } = req.body;
        if (!name || price == null) {
            return res
            .status(400)
            .json({success: false, message: "Faltan campos obligatorios: name, price"});
        }
        const newProduct = await Product.create({
            name,
            price,
            description,
            stock,
            category,
            brand,
            images,
            isFeatured,
            tags,
        });
        res.status(201).json({success: true, data: newProduct});
    } catch (error) {
        res.status(500).json({success: false, message: "Error al crear el producto"});
    }
});

// PUT /api/products/:id - Solo admin
router.put("/:id", authMiddleware, adminOnly, async (req, res) => {
    try{
    const allowedFields = [
        "name",
        "price",
        "description",
        "stock",
        "category",
        "brand",
        "images",
        "isFeatured",
        "tags",
        "active",
    ];
    // Filtrar el body para evitar que se actualicen campos no permitidos
    const updates = {};
    for (const key of allowedFields) {
        if (req.body[key] !== undefined) {
            updates[key] = req.body[key];
        }
    }
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updates,
        {new: true} // Devuelve el documento actualizado
    );
    if (!updatedProduct) {
        return res.status(404).json({success: false, message: "Producto no encontrado"});
    }
    res.json({success: true, data: updatedProduct});
    } catch (error) {
        console.log(error);
        res.status(400).json({success: false, message: "ID de producto inválido"});
    }   
});

// DELETE /api/products/:id - Solo admin
router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(
            req.params.id,
            {active: false},
            {new: true}
        );
        if (!deletedProduct) {
            return res.status(404).json({success: false, message: "Producto no encontrado"});
        }
        res.json({
            success: true,
            message: "Producto eliminado correctamente",
            data: deletedProduct,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({success: false, message: "ID de producto inválido"});
    }
});

//POST /api/products - Crear un nuevo producto

router.post("/", async (req, res) => {
    try {
        const {name, price, description, stock, category, active} = req.body;

        if (!name || price == null || stock == null) {
            return res 
            .status(400)
            .json({success: false, message: "Faltan campos obligatorios: name, price, stock"});
        }
        const newProduct = await Product.create({
            name,
            price,
            description,
            stock,
            category,
        });
        res.status(201).json({success: true, data: newProduct});
    } catch (error) {
        res.status(500).json({success: false, message: "Error al crear el producto"});
    }
});

// PUT /api/products/:id - Actualizar un producto 
router.put("/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}// Devuelve el documento actualizado
        );
    
        if (!updatedProduct) {
            return res.status(404).json({success: false, message: "Producto no encontrado"});
        }
        res.json({success: true, data: updatedProduct});
    } catch (error) {
        res.status(400).json({success: false, message: "ID de producto inválido"});
    }
});

// DELETE /api/products/:id - Eliminar un producto
router.delete("/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(
            req.params.id,
            {active: false},
            {new: true}
        );

        if (!deletedProduct) {
            return res.status(404).json({success: false, message: "Producto no encontrado"});
        }
        res.json({success: true, message: "Producto eliminado correctamente", data: deletedProduct});
    } catch (error) {
        res.status(400).json({success: false, message: "ID de producto inválido"});
    }   
});



export default router;