const db = require("../common/mongoDBConfig");
const UserModal = require("../common/modals/UserModal");
const jwtService = require("../common/jwtService");
const validationService = require("../common/validationService");
const responseService = require("../common/responseService");
exports.update = async(event, context) => {

    context.callbackWaitsForEmptyEventLoop = false;
    var input = JSON.parse(event.body);
    if (input.userId && input.password) {

        let dbConnection = await db.connectDB();
        if (dbConnection) {
            let userResult = await UserModal.User.findOne({ "id": input.userId });
            if (userResult) {
                let hashedPassword = await validationService.getHash(input.password);

                if (hashedPassword) {
                    userResult.password = hashedPassword;
                    userResult.modified_date = new Date();
                    let updateResult = await UserModal.User.updateOne({ "id": userResult.id }, userResult);
                    if (updateResult) {
                        let jwtPayload = {
                            "id": userResult.id,
                            "email": userResult.email,
                            "mobile": userResult.mobile
                        };
                        let getTokenResult = await jwtService.getToken(jwtPayload);
                        if (getTokenResult.status) {
                            return responseService.prepareResponse(200, { "status": true, "id": userResult.id, "token": getTokenResult.token, "message": "Password updated Successfully" });
                        } else {
                            return responseService.prepareResponse(200, { "status": false, "message": "Unable to update Password" });
                        }
                    } else {
                        return responseService.prepareResponse(200, { "status": false, "message": "Unable to update Password" });
                    }
                } else {
                    return responseService.prepareResponse(200, { "status": false, "message": "Unable to update Password" });
                }
            } else {
                return responseService.prepareResponse(200, { "status": false, "message": "User Data not founded!" });
            }
        } else {
            return responseService.prepareResponse(200, { "status": false, "message": "Error in DB Connection" });
        }
    } else {
        return responseService.prepareResponse(200, { "status": false, "message": "Invalid Request, please check!" });
    }
};