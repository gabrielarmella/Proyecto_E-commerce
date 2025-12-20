import { productDAO } from "../daos/factory.dao.js";

class ProductRepository {
    find(filter ={}, projection = null, options = {}){
        return productDAO.find(filter, projection, options);
    }
    findOne(filter = {}, projection = null, options = {}){
        return productDAO.findOne(filter, projection, options);
    }
    findById(id, projection = null, options = {}){
        return productDAO.findById(id, projection, options);
    } 
    countDocuments(filter = {}){
        return productDAO.count(filter);
    }
    create(doc){
        return productDAO.create(doc);
    }
    findByIdAndUpdate(id, update, options = {new:true}){
        return productDAO.updateById(id, update, options);
    }
    fidnByIdAndDelete(id){
        return productDAO.deleteById(id);
    }
}

export default new ProductRepository();