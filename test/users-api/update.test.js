beforeEach(() => {
    jest.resetModules();
    process.env = {
        AWS_REGION: 'us-east-1',
        DYNAMO_DB_TABLE: 'einthotel-booking-backend-dev-users-api',
        CONSUMER_USER_POOL_ID: 'us-east-1_2ijzX06H2'
    };
});

test('update user', async () => {
    const func = require("../../src/users-api");
    const body = JSON.stringify(
        {
            "id": "admin",
            "name": "Tharanga Thennakoon V1",
            "phoneNumber": "+940719190000",
        }
    )
    const event = {
        resource: '/users',
        httpMethod: 'PUT',
        body: Buffer.from(body).toString('base64'),
        pathParameters: {},
        requestContext: {
            authorizer: {
                principalId: '8af341b2-d235-4a58-bff7-e4f1617ecffc'
            }
        }
    };
    const acctual = await func.handler(event, {});
    console.log(acctual)
    expect(200).toEqual(acctual.statusCode);
}, 30000);