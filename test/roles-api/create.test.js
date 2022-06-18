beforeEach(() => {
    jest.resetModules();
    process.env = {
        AWS_REGION: 'us-east-1',
        DYNAMO_DB_TABLE: 'einthotel-booking-backend-dev-roles-api'
    };
});

// dont change this. this will create admin role
test('create admin', async () => {
    const func = require("../../src/roles-api");
    const body = JSON.stringify(
        {
            "id": "admin",
            "permissions": ["all"],
        }
    )
    const event = {
        resource: '/roles',
        httpMethod: 'POST',
        body: Buffer.from(body).toString('base64'),
        pathParameters: {},
        requestContext: {
            authorizer: {
                principalId: 'u1'
            }
        }
    };
    const acctual = await func.handler(event, {});
    console.log(acctual)
    expect(201).toEqual(acctual.statusCode);
}, 30000);