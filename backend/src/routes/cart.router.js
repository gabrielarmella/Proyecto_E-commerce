import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import cartController from '../controllers/cart.controller.js';

const router = Router();

//Get /api/cart - Obtener el carrito del usuario 
router.get('/', authMiddleware, cartController.getCart);

//POST /api/cart/items - Agregar un producto al carrito
router.post('/add', authMiddleware, cartController.addItem);

//PUT /api/cart/item/ - Actualizar la cantidad de un producto en el carrito
router.put('/item/:productId', authMiddleware, cartController.updateItemQuantity);

//DELETE /api/cart/item/:productId - Eliminar un producto del carrito
router.delete('/item/:productId', authMiddleware, cartController.removeItem);

//POST /api/cart/clear - Vaciar el carrito del usuario
router.post('/clear', authMiddleware, cartController.clearCart);

export default router;