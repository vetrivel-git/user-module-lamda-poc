const mongoDbConfig = require('../mongoDBConfig');
var userSchema = new mongoDbConfig.dbService.Schema({
    id: {
        type: String,
        required: [true, "User ID is Required"]
    },
    name: {
        type: String,
        required: [true, "User Name is Required"]
    },
    mobile: {
        type: String,
        required: [true, "Mobile Number is Required"]
    },
    email: {
        type: String,
        required: [true, "Email Address is Required"]
    },
    password: {
        type: String
    },
    photo: {
        type: String
    },
    id_card_type: {
        type: String,
        required: [true, "ID Card Type is Required"]
    },
    id_card_number: {
        type: String,
        required: [true, "ID Card Number is Required"]
    },
    id_card_pdf: {
        type: String
    },
    modified_date: {
        type: Date
    }
});

userSchema.plugin(mongoDbConfig.mongoosePaginate);

var User = mongoDbConfig.dbService.model('users', userSchema);

module.exports = {
    User
}