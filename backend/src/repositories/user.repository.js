import { userDAO } from "../dao/factory.dao.js";

class UserRepository{
       find(filter = {}, projection = null, options = {}) {
        return userDAO.find(filter, projection, options);
    }

    findOne(filter = {}, projection = null, options = {}) {
        return userDAO.findOne(filter, projection, options);
    }

    findById(id, projection = null, options = {}) {
        return userDAO.findById(id, projection, options);
    }

    create(doc) {
        return userDAO.create(doc);
    }

    findByIdAndUpdate(id, update, options = { new: true }) {
        return userDAO.updateById(id, update, options);
    }

    findByIdAndDelete(id) {
        return userDAO.deleteById(id);
    }
}

export default new UserRepository();