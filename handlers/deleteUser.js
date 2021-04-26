const db = require("../common/mongoDBConfig");
const dynamoDbService = require("../common/dynamoDBConfig");
const UserModal = require("../common/modals/UserModal");
const responseService = require("../common/responseService");
exports.delete = async(event, context) => {

    context.callbackWaitsForEmptyEventLoop = false;
    var input = event.queryStringParameters;

    if (input) {

        let connectionResponse = await db.connectDB();
        if (connectionResponse) {
            try {
                var dbResponse = await UserModal.User.deleteOne({ "id": input.id });
                if (dbResponse) {
                    await dynamoDbService.Delete(input.id).catch((error) => {
                        response.body = JSON.stringify({ status: false, dynamoDbService: error });
                        return response;
                    });
                    return responseService.prepareResponse(200, { "status": true, "message": "User Deleted Successfully" });
                } else {
                    return responseService.prepareResponse(200, { "status": false, "message": "Unable to Delete User" });
                }
            } catch (error) {
                return responseService.prepareResponse(200, { "status": false, "message": "Unable to Delete User", "error": error });
            }
        } else {
            return responseService.prepareResponse(200, { "status": false, "message": "Unable to Connect Db" });
        }
    } else {
        return responseService.prepareResponse(200, { "status": false, "message": "Invalid Request,Please check!" });
    }
};