const validationService = require("../common/validationService");
const UserModal = require("../common/modals/UserModal");
const jwtService = require("../common/jwtService");
const db = require("../common/mongoDBConfig");
const responseService = require("../common/responseService");
exports.login = async(event, context) => {

    context.callbackWaitsForEmptyEventLoop = false;
    var input = JSON.parse(event.body);
    var emailValidation = await validationService.validateEmail(input.email);
    if (input.email && emailValidation.status && input.password) {

        try {
            let dbConnection = await db.connectDB();
            if (dbConnection) {
                let userResult = await UserModal.User.findOne({ "email": input.email.trim() });
                if (userResult) {
                    let compareResult = await validationService.compareHash(input.password, userResult.password);
                    if (compareResult) {
                        let jwtPayload = {
                            "id": userResult.id,
                            "email": userResult.email,
                            "mobile": userResult.mobile
                        };
                        let getTokenResult = await jwtService.getToken(jwtPayload);
                        if (getTokenResult.status) {
                            return responseService.prepareResponse(200, { "status": true, "id": userResult.id, "token": getTokenResult.token, "message": "Successfully Login" });
                        } else {
                            return responseService.prepareResponse(200, { "status": false, "message": "Unable to Login" });
                        }
                    } else {
                        return responseService.prepareResponse(200, { "status": false, "message": "Unable to Login" });
                    }
                } else {
                    return responseService.prepareResponse(200, { "status": false, "message": "User Data Not Founded!" });
                }
            } else {
                return responseService.prepareResponse(200, { "status": false, "message": "Unable to get User" });
            }
        } catch (error) {
            return responseService.prepareResponse(200, { "status": false, "message": "Unable to get User" });
        }
    } else {
        return responseService.prepareResponse(200, { "status": false, "message": "Invalid Request,Please check!" });
    }
};