beforeEach(() => {
    jest.resetModules();
    process.env = {
        AWS_REGION: 'us-east-1',
        DYNAMO_DB_TABLE: 'einthotel-booking-backend-dev-apps-api',
        AUTHORIZER_API_FUNC: 'einthotel-booking-backend-dev-authorizer-api'
    };
});

test('create success', async () => {
    const func = require("../../src/apps-api");
    const body = JSON.stringify(
        {
            "name": "app-1",
        }
    )
    const event = {
        resource: '/apps',
        httpMethod: 'POST',
        body: Buffer.from(body).toString('base64'),
        pathParameters: {},
        requestContext: {
            authorizer: {
                principalId: 'dc246d8a-db7d-4a26-9b6b-f377eb77e5bf'
            }
        }
    };
    const acctual = await func.handler(event, {});
    console.log(acctual)
    expect(acctual.statusCode).toEqual(201);
}, 30000);