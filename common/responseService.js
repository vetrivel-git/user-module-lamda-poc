exports.prepareResponse = (statusCode, data) => {
    let response = {
        "headers": {
            'Access-Control-Allow-Origin': '*',
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key"
        },
        "statusCode": statusCode,
        "body": JSON.stringify(data),
    };
    return response;
};