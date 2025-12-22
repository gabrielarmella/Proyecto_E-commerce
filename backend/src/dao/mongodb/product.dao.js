import MongoDAO from "./mongo.dao.js";
import Product from "../../models/product.model.js";

class ProductDAO extends MongoDAO {
    constructor() {
        super(Product);
    }
}

export default ProductDAO;