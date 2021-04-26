const jwt = require("jsonwebtoken");

const GET_JWT_SECRET_KEY = (userId) => { return `USERPORTAL@${userId}` };

const getToken = async(payload) => {

    if (payload) {
        let generatedToken = jwt.sign(payload, GET_JWT_SECRET_KEY(payload.id), { expiresIn: 86400 });
        return { status: true, token: generatedToken };
    } else {
        return { status: false, message: "Unable to generate token" };
    }
};

const verifyToken = async(token) => {

    if (token) {
        let decodedToken = jwt.decode(token);
        if (decodedToken) {
            let verifiedToken = jwt.verify(token, GET_JWT_SECRET_KEY(decodedToken.id));
            if (verifiedToken) {
                return { status: true, message: "Token Verified", ...decodedToken };
            } else {
                return { status: false, message: "Token Not Verified" };
            }
        } else {
            return { status: false, message: "Unable to Decode" };
        }
    } else {
        return { status: false, message: "Token not Found" };
    }
};

module.exports = {
    getToken,
    verifyToken
}