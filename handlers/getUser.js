const UserModal = require("../common/modals/UserModal");
const db = require("../common/mongoDBConfig");
const responseService = require("../common/responseService");
exports.get = async(event, context) => {

    context.callbackWaitsForEmptyEventLoop = false;
    var input = event.queryStringParameters;
    try {
        var connectionResponse = await db.connectDB();
        if (connectionResponse) {

            var filter = {};
            if (input) {
                filter = { "id": input.id };
            }
            var dbResult = await UserModal.User.find(filter);
            return responseService.prepareResponse(200, { "status": true, "userData": dbResult });
        } else {
            return responseService.prepareResponse(200, { "status": false, "message": "Error in get User" });
        }
    } catch (error) {
        return responseService.prepareResponse(200, { "status": false, "message": "Error in get User" });
    }
};