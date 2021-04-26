exports.sendMail = async(subject, message, toMailAddress, emailService) => {
    // Create sendEmail params 
    var params = {
        Destination: { /* required */
            ToAddresses: [
                toMailAddress,
                /* more items */
            ]
        },
        Message: { /* required */
            Body: { /* required */
                Text: {
                    Charset: "UTF-8",
                    Data: message
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject
            }
        },
        Source: 'GreenWay <angopensource@gmail.com>',
        /* required */
    };

    // Create the promise and SES service object
    var sendResult = await emailService.sendEmail(params).promise();
    // console.log("sendResult=======", sendResult);
    if (sendResult) {
        return { response: true, status: "Email Sent", desc: sendResult };
    } else {
        return { response: false, status: "Error in Sending Mail", desc: sendResult };
    }
};