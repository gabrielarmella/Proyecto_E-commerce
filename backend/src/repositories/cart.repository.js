import { cartDAO } from "../dao/factory.dao.js";

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
    findByUser(userId, options = {}){
        return cartDAO.findOne({ user:userId}, null, options);
    }
    create(doc, options = {}) {
        return cartDAO.create(doc, options);
    }
    createForUser(userId, options = {}){
        return cartDAO.create({user: userId, items: []}, options);
    }
    findByIdAndUpdate(id, updates, options = { new: true }) {
        return cartDAO.updateById(id, updates, options);
    }
    findByIdAndDelete(id) {
        return cartDAO.deleteById(id);
    }
    updateOne(filter, updates, options = {}){
        return cartDAO.updateOne(filter, updates, options);
    }
    saveCart(cart, options = {}){
        return cart.save(options);
    }
    populateCart(cart, select = "name price stock active images", session){
        return cart.populate({
            path: "items.product",
            select,
            options: session ? { session } : undefined,
        });
    }
}

export default new CartRepository();
