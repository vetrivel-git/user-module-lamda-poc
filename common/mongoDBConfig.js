const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongoDbURL = "mongodb://174.129.161.185:27017/user-portal";
const connectionOption = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
};
var cachedConnection = null;
const connectDB = async() => {
    if (cachedConnection) {
        return Promise.resolve(cachedConnection);
    } else {
        cachedConnection = await newConnection();
        return Promise.resolve(cachedConnection);
    }
};

async function newConnection() {
    var databaseConnection = await mongoose.connect(
        mongoDbURL,
        connectionOption
    );
    return databaseConnection;
};

module.exports = {
    dbService: mongoose,
    mongoosePaginate,
    connectDB
}