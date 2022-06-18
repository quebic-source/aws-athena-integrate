beforeEach(() => {
    jest.resetModules();
    process.env = {
        AWS_REGION: 'us-east-1',
        DYNAMO_DB_TABLE: 'einthotel-booking-backend-dev-authorizer-api',
        USERS_API_FUNC: 'einthotel-booking-backend-dev-users-api',
    };
});

test('associate-users success', async () => {
    const func = require("../../src/authorizer-api");
    const body = JSON.stringify(
        {
        }
    )
    const event = {
        resource: '/auth/associate-users',
        httpMethod: 'GET',
        body: Buffer.from(body).toString('base64'),
        pathParameters: {},
        queryStringParameters: {
            "resourceId": "location/TewiuzHRfT-PvzEzU6V4F/TnijPK8Jxv3i4p_xTOVOM"
        }
    };
    const acctual = await func.handler(event, {});
    console.log(acctual)
    expect(200).toEqual(acctual.statusCode);
}, 30000);