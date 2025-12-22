import ProductDAO from "./mongodb/product.dao.js";
import CartDAO from "./mongodb/cart.dao.js";
import UserDAO from "./mongodb/user.dao.js";
import OrderDAO from "./mongodb/order.dao.js";

const persistence = process.env.PERSISTENCE || "mongo";

let productDAO;
let cartDAO;
let userDAO;
let orderDAO;

switch (persistence) {
    case "mongo":
        productDAO = new ProductDAO();
        cartDAO = new CartDAO();
        userDAO = new UserDAO();
        orderDAO = new OrderDAO();
        break;
}

export { productDAO, cartDAO, userDAO, orderDAO };