class MongoDAO {
    constructor(model) {
        this.model = model;
    }

    find(filter = {}, projection = null, options = {}) {
        return this.model.find(filter, projection, options);
    }

    findOne(filter = {}, projection = null, options = {}) {
        return this.model.findOne(filter, projection, options);
    }
    findById(id, projection = null, options = {}) {
        return this.model.findById(id, projection, options);
    }
     create(doc, options = {}) {
        const instance = new this.model(doc);
        return instance.save(options);
    } 
    updateById(id, updates, options = { new: true }) {
        return this.model.findByIdAndUpdate(id, updates, options);
    }
    updateOne(filter, updates, options = {}){
        return this.model.updateOne(filter, updates, options);
    }
    findOneAndUpdate(filter, updates, options = { new:true }){
        return this.model.findOneAndUpdate(filter, updates, options);
    }
    deleteById(id) {
        return this.model.findByIdAndDelete(id);
    }
    count (filter = {}) {
        return this.model.countDocuments(filter);
    }
}

export default MongoDAO;
