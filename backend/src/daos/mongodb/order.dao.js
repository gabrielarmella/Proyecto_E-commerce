import MongoDAO from "./mongo.dao.js";
import Order from "../../models/order.model.js";

class OrderDAO extends MongoDAO {
    constructor() {
        super(Order);
    }
}

export default OrderDAO;