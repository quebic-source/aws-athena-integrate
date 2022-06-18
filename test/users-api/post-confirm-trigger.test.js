beforeEach(() => {
    jest.resetModules();
    process.env = {
        AWS_REGION: 'us-east-1',
        DYNAMO_DB_TABLE: 'einthotel-booking-backend-dev-users-api'
    };
});

// dont change this. this will create admin role
test('post confirm', async () => {
    const func = require("../../src/users-api/index-post-confirm-cognito-trigger");
    const event = {
        "version": "1",
        "region": "us-east-1",
        "userPoolId": "us-east-1_2ijzX06H2",
        "userName": "74cb0684-ff2c-4fd3-b413-e72d63a1704d",
        "callerContext": {
            "awsSdkVersion": "aws-sdk-unknown-unknown",
            "clientId": "4utdeeteo62aq3p39d0cqut1g4"
        },
        "triggerSource": "PostConfirmation_ConfirmSignUp",
        "request": {
            "userAttributes": {
                "sub": "74cb0684-ff2c-4fd3-b413-e72d63a1704d",
                "email_verified": "true",
                "cognito:user_status": "CONFIRMED",
                "cognito:email_alias": "tharanganilupul@gmail.com",
                "name": "tharanga",
                "email": "tharanganilupul@gmail.com"
            }
        },
        "response": {}
    };
    const callback = (error, result) => {
        console.log("result", result);
        expect(error).toEqual(null);
    }
    await func.handler(event, {}, callback);
}, 30000);