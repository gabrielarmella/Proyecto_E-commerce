import MongoDAO from "./mongo.dao.js";
import User from "../../models/user.model.js";

class UserDAO extends MongoDAO {
    constructor() {
        super(User);
    }
}

export default UserDAO;