import { productDAO } from "../dao/factory.dao.js";

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
    async findProducts ({filter = {}, sort = {}, skip = 0, limit = 20}){
        const [products, total] = await Promise.all([
            productDAO.find(filter, null, {sort, skip, limit}),
            productDAO.count(filter),
        ]);
        return { products, total};
    }
    create(doc, options = {}){
        return productDAO.create(doc, options);
    }
    updateById(id, updates, options = {new:true}){
        return productDAO.updateById(id, updates, options);
    }
    deleteById(id){
        return productDAO.deleteById(id);
    }
    decrementStock(productId, quantity, session){
        return productDAO.findOneAndUpdate(
            {_id: productId, stock: { $gte: quantity }, active: true },
            { $inc: { stock: -quantity } },
            { new: true, session}
        );
    }
}

export default new ProductRepository();