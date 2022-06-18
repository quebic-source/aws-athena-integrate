beforeEach(() => {
    jest.resetModules();
    process.env = {
        AWS_REGION: 'us-east-1',
        DYNAMO_DB_TABLE: 'einthotel-booking-backend-dev-authorizer-api',
    };
});

test('associate-resources success', async () => {
    const func = require("../../src/authorizer-api");
    const body = JSON.stringify(
        {
        }
    )
    const event = {
        resource: '/auth/associate-resources',
        httpMethod: 'GET',
        body: Buffer.from(body).toString('base64'),
        pathParameters: {},
        queryStringParameters: {
            "principleId": "64c91817-e950-45f9-b43f-8373b5764a7d",
            "resourcePathPrefix": "app/",
            "pageSize":6,

        }
    };
    const acctual = await func.handler(event, {});
    console.log(acctual)
    expect(200).toEqual(acctual.statusCode);
}, 30000);