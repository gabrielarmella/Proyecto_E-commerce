import MongoDAO from "./mongo.dao.js";
import Cart from "../../models/cart.model.js";

class CartDAO extends MongoDAO {
    constructor() {
        super(Cart);
    }
}

export default CartDAO;