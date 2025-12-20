import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import userRepository from "../repositories/user.repository.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Operaciones de autenticación de usuarios
 */
const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Gabriel
 *               email:
 *                 type: string
 *                 example: gabo@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Datos inválidos o usuario ya existe
 */
// POST /api/auth/register - Registrar un nuevo usuario
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "Faltan campos obligatorios: name, email, password" });
        }

        const existing = await userRepository.findOne({ email });
        if (existing) {
            return res
                .status(409)
                .json({ success: false, message: "El email ya está registrado" });
        }   

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await userRepository.create({
            name,
            email,
            passwordHash,
            // role se asigna automáticamente como "user" a menos que se especifique lo contrario
            role: "user",
        });

        const userResponse = {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        };

        return res.status(201).json({
            success: true,
            message: "Usuario registrado correctamente",
            user: userResponse,
        });
    } catch (error) {
        console.error("REGISTER ERROR => ", error);
        return res
            .status(500)
            .json({ success: false, message: "Error al registrar el usuario" });
    }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: gabo@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve token JWT
 *       400:
 *         description: Credenciales inválidas
 */
// POST /api/auth/login - Iniciar sesión de usuario
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
            .status(400)
            .json({ success: false, message: "Faltan campos obligatorios: email y password" });  
        }

        const user = await userRepository.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Credenciales inválidas" });
        }
        if (!user.passwordHash) {
            return res.status(400).json({ success: false, message: "Esta cuenta fue creada con Google. Por favor, inicia sesión con Google." });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res
            .status(401)
            .json({ success: false, message: "Credenciales inválidas" });
        }

        const token = jwt.sign(
            {
                id: user._id, role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        return res.json({
            success: true,
            message: "Login exitoso",
            token,
            user: userResponse,
        });
    }catch (error) {
        console.error("LOGIN ERROR =>", error);
        return res
        .status(500)
        .json({ success: false, message: "Error al iniciar sesión" });
    }
});
// GET /api/auth/google - Iniciar sesión con Google
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })    
);
// GET /api/auth/google/callback - Callback de Google
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user._id, role: req.user.role },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );
        res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
    }
);

//Get /api/auth/me - Obtener datos del usuario autenticado
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await userRepository.findById(req.user.id).select("-passwordHash");
        if (!user) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al obtener los datos del usuario" });
    }
});

// POST /api/auth/set-password - Establecer o cambiar la contraseña del usuario
router.post("/set-password", authMiddleware, async (req, res) => {
    try {
        const {password} = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ success: false, message: "La contraseña debe tener al menos 6 caracteres" });
        }
        const user = await userRepository.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }
        // Hashear la nueva contraseña
        const passwordHash = await bcrypt.hash(password, 10);
        user.passwordHash = passwordHash;

        await user.save();
        return res.json({ success: true, message: "Contraseña actualizada correctamente" });
    } catch (error) {
        console.error("SET PASSWORD ERROR =>", error);
        return res.status(500).json({ success: false, message: "Error al actualizar la contraseña" });
    }
});

export default router;
