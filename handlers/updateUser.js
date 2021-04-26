const dynamoDbService = require('../common/dynamoDBConfig');
const UserModal = require("../common/modals/UserModal");
const db = require("../common/mongoDBConfig");
const fileUpload = require("../common/fileUpload");
const responseService = require("../common/responseService");
exports.update = async(event, context) => {

    context.callbackWaitsForEmptyEventLoop = false;

    var input = (event.body) ? JSON.parse(event.body) : event;
    if (input.id) {
        try {
            let connectResponse = await db.connectDB();
            if (connectResponse) {
                let prepareData = {};

                if (input.name) {
                    prepareData["name"] = input.name;
                }
                if (input.email) {
                    prepareData["email"] = input.email;
                }
                if (input.mobile) {
                    prepareData["mobile"] = input.mobile;
                }
                if (input.id_card_type) {
                    prepareData["id_card_type"] = input.id_card_type;
                }
                if (input.id_card_number) {
                    prepareData["id_card_number"] = input.id_card_number;
                }
                if (input.photo) {
                    prepareData["photo"] = await fileUpload.update(input.id, "user-portal-photo", input.photo);
                }
                if (input.id_card_pdf) {
                    prepareData["id_card_pdf"] = await fileUpload.update(input.id, "user-portal-id-card", input.id_card_pdf);
                }

                if (prepareData) {

                    let filter = {
                        "id": input.id
                    };
                    let updateResult = await UserModal.User.updateOne(filter, prepareData);

                    if (input.id_card_type === "Aadhaar") {
                        let data = {
                            "userId": input.id,
                            "id_card_type": input.id_card_type,
                            "id_card_number": input.id_card_number,
                            "updated": new Date().getTime().toString(),
                        };
                        await dynamoDbService.update(data);
                    }

                    if (updateResult) {
                        return responseService.prepareResponse(200, { "status": true, "message": "User Updated Successfully" });
                    } else {
                        return responseService.prepareResponse(200, { "status": false, "message": "Unable to update user" });
                    }
                } else {
                    return responseService.prepareResponse(200, { "status": false, "message": "Unable to update user" });
                }

            } else {
                return responseService.prepareResponse(200, { "status": false, "message": "Error in DB Connection" });
            }
        } catch (error) {
            return responseService.prepareResponse(200, { "status": false, "message": "Unable to update user", error: error });
        }

    } else {
        return responseService.prepareResponse(200, { "status": false, "message": "Invalid Request, please check!" });
    }
};