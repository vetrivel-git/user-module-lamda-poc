const userModal = require('../common/modals/UserModal');
const dynamoDbService = require('../common/dynamoDBConfig');
const db = require("../common/mongoDBConfig");
const fileUpload = require("../common/fileUpload");
const validationService = require("../common/validationService");
const notificationService = require("../common/notificationService");
const responseService = require("../common/responseService");

exports.create = async(event, context) => {

    context.callbackWaitsForEmptyEventLoop = false;
    var input = (event.body) ? JSON.parse(event.body) : event;


    var emailValidation = await validationService.validateEmail(input.email);
    var existResult = await validationService.checkEmailExist(input.email);

    if (emailValidation.status && !existResult.status) {

        const userID = (`USR${new Date().getTime().toString()}${Math.floor(Math.random()*100000).toString()}`);
        var connectionResponse = await db.connectDB();
        if (connectionResponse) {
            await userModal.User.create({
                "id": userID,
                "name": input.name,
                "email": input.email,
                "mobile": input.mobile,
                "id_card_type": input.id_card_type,
                "id_card_number": input.id_card_number,
                "photo": (input.photo) ? await fileUpload.upload(userID, "user-portal-photo", input.photo) : "",
                "id_card_pdf": (input.id_card_pdf) ? await fileUpload.upload(userID, "user-portal-id-card", input.id_card_pdf) : "",
            });

            if (input.id_card_type === "Aadhaar") {
                let data = {
                    "userId": userID,
                    "id_card_type": input.id_card_type,
                    "id_card_number": input.id_card_number,
                    "created": new Date().getTime().toString(),
                };
                await dynamoDbService.create(data);
            };

            let emailText = `Dear ${input.name}, Registration Completed Successfully, please click here to update your login password. http://greenway-vue-poc.s3-website-us-east-1.amazonaws.com/password/${userID}`;

            await notificationService.sendMail("Registration-Success", emailText, input.email, dynamoDbService.emailService);
            return responseService.prepareResponse(200, { "status": true, "message": "User Created Successfully", "userId": userID });
        } else {
            // console.log("Error in dbConnection =======", connectionResponse);
            return responseService.prepareResponse(200, { "status": false, "message": "Error in DB Connection" });
        }
    } else {
        return responseService.prepareResponse(200, { "status": false, "message": "Invalid Email or Email not Exist" });
    }
};