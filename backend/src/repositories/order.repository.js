import { orderDAO } from "../dao/factory.dao.js";

class OrderRepository {
    find(filter = {}, projection = null, options = {}) {
        return orderDAO.find(filter, projection, options);
    }
    findOne(filter = {}, projection = null, options = {}) {
        return orderDAO.findOne(filter, projection, options);
    }
    findById(id, projection = null, options = {}) {
        return orderDAO.findById(id, projection, options);
    }
    create(doc, options = {}) {
        return orderDAO.create(doc, options);
    }
    countDocuments(filter = {}) {
        return orderDAO.count(filter);
    }
    findByIdAndUpdate(id, updates, options = { new: true }) {
        return orderDAO.updateById(id, updates, options);
    }
    findByIdAndDelete(id) {
        return orderDAO.deleteById(id);
    }
}

export default new OrderRepository();