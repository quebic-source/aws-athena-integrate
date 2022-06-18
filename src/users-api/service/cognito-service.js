const AWS = require("aws-sdk");

class CognitoService {
    constructor() {
        this.consumerUsePool = process.env.CONSUMER_USER_POOL_ID;
        this.cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
    }

    async updateUser({ id, name, phoneNumber }) {
        var params = {
            UserAttributes: [
                // {
                //     Name: 'name',
                //     Value: name
                // },
                {
                    Name: 'phone_number',
                    Value: phoneNumber
                },
            ],
            UserPoolId: this.consumerUsePool,
            Username: id
        };
        this.cognitoIdentityServiceProvider.adminUpdateUserAttributes(params).promise();
    }
}

module.exports = CognitoService;