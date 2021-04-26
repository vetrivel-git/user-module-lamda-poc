const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'AKIA22TQDAYDAZVBH4H4',
    secretAccessKey: '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'
});

const dynamoDbService = new AWS.DynamoDB.DocumentClient();
const s3Service = new AWS.S3({ region: 'us-east-1' });
var emailService = new AWS.SES({ apiVersion: '2010-12-01' });

const create = async(data) => {
    let addObject = {
        "TableName": "UserPortal",
        Item: {...data }
    };
    var dbResult = await dynamoDbService.put(addObject).promise().catch((error) => {
        console.log("Error in dynamoDb put====", error);
    });
    // console.log("dbResponse in dynamoDb=create=======", dbResult);
    return dbResult;
};


const update = async(data) => {
    var updateObject = {
        "TableName": "UserPortal",
        Key: { "userId": data.userId },
        ExpressionAttributeValues: {
            ":card_type": data.id_card_type,
            ":card_number": data.id_card_number,
            ":updated": data.updated
        },
        UpdateExpression: "set id_card_type = :card_type, id_card_number = :card_number, updated = :updated",
        ReturnValues: "UPDATED_NEW"
    };
    var dbResponse = await dynamoDbService.update(updateObject).promise();
    // console.log("dbResponse in dynamoDb=update=======", dbResponse);
    return dbResponse;
};


const Delete = async(userId) => {

    let params = {
        TableName: "UserPortal",
        Key: { "userId": userId }
    }

    var dbResponse = await dynamoDbService.delete(params).promise();
    // console.log("dbResponse in dynamoDb=delete=======", dbResponse);
    return dbResponse;
};


module.exports = {
    dynamoDbService,
    s3Service,
    emailService,
    create,
    update,
    Delete
}