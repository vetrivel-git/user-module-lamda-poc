const s3Service = require("./dynamoDBConfig").s3Service;

exports.upload = async(userID, sourceName, base64Image) => {
    const mime = base64Image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    var contentType = (mime && mime.length > 0) ? mime[1] : null;
    // var extension = contentType.split('/')[1];
    var base64 = base64Image.replace(/^data:.+;base64,/, "");
    var bufferString = Buffer.from(base64, "base64");
    var params = {
        "Body": bufferString,
        "ContentType": contentType,
        "Key": `${userID}`,
        "Bucket": sourceName,
        "ACL": "public-read",
        "ContentEncoding": "base64",
    };
    await s3Service.putObject(params).promise();

    // console.log("addResult in s3 service======", addResult);
    var url = `https://${sourceName}.s3.amazonaws.com/${userID}`;
    return url;
};

exports.update = async(userID, sourceName, base64Image) => {
    if (userID && sourceName && base64Image) {
        var getResult = await s3Service.getObject({ "Bucket": sourceName, "Key": `${userID}` }).promise();
        // console.log("getResult========", getResult);
        if (getResult) {
            var deleteExistResult = await s3Service.deleteObject({ "Bucket": sourceName, "Key": `${userID}` }).promise().catch((error) => {
                console.log("Error in deleteObject s3 bucket", error);
            });
            // console.log("deleteExistResult========", deleteExistResult);
            if (deleteExistResult) {
                return await this.upload(userID, sourceName, base64Image);
            } else {
                return "";
            }
        } else {
            return await this.upload(userID, sourceName, base64Image);
        }
    } else {
        return "";
    }
};