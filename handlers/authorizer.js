const jwtService = require("../common/jwtService");
const generatePolicy = (allow) => {
    return {
        principalId: "token",
        policyDocument: {
            Version: "2012-10-17",
            Statement: {
                Action: "execute-api:Invoke",
                Effect: (allow) ? "Allow" : "Deny",
                Resource: "*",
            },
        },
    };
};

exports.auth = async(event, context) => {

    context.callbackWaitsForEmptyEventLoop = false;
    const token = event.authorizationToken;
    if (token) {
        var verifyResult = await jwtService.verifyToken(token);
        // console.log("verifyResult========", verifyResult);
        if (verifyResult.status) {
            return generatePolicy(true);
        } else {
            return generatePolicy(false);
        }
    }
};