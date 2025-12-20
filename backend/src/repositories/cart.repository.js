import { cartDAO } from "../daos/factory.dao.js";

class CartRepository {
    find(filter = {}, projection = null, options = {}) {
        return cartDAO.find(filter, projection, options);
    }
    findOne(filter = {}, projection = null, options = {}) {
        return cartDAO.findOne(filter, projection, options);
    }
    findById(id, projection = null, options = {}) {
        return cartDAO.findById(id, projection, options);
    }
    create(doc) {
        return cartDAO.create(doc);
    }
    findByIdAndUpdate(id, updates, options = { new: true }) {
        return cartDAO.updateById(id, updates, options);
    }
    findByIdAndDelete(id) {
        return cartDAO.deleteById(id);
    }
}

export default new CartRepository();