const db = require("./mongoDBConfig");
const UserModal = require("./modals/UserModal");
const bcrypt = require('bcryptjs');

const validateEmail = async(email) => {

    var validResult = {
        status: true,
        message: "Valid Email Address"
    };
    var invalidResult = {
        status: false,
        message: "Invalid Email Address"
    };

    if (typeof email === "string" && email.trim().length > 0) {
        if (RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(email.trim())) {
            return validResult;
        } else {
            return invalidResult;
        }
    } else {
        return invalidResult;
    }
};

const checkEmailExist = async(email) => {

    var email = email;
    var existResult = {
        status: true,
        message: "Email Exist!"
    };
    var notExistResult = {
        status: false,
        message: "Email Not Exist!"
    };

    var connectionResponse = await db.connectDB();
    if (connectionResponse) {
        var dbResult = await UserModal.User.findOne({
            "email": email
        });
        // console.log("dbResult======", dbResult);
        if (dbResult) {
            return existResult;
        } else {
            return notExistResult;
        }
    } else {
        notExistResult.message = "Error in DB Connection";
        return notExistResult;
    }
};

const getHash = async(value) => {

    let hashedData = await bcrypt.hash(value, 8);
    return hashedData;
};

const compareHash = async(passwordString, hashValue) => {

    let compareResult = await bcrypt.compare(passwordString, hashValue);
    return compareResult;
};

module.exports = {
    checkEmailExist,
    validateEmail,
    getHash,
    compareHash
}