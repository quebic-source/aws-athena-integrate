beforeEach(() => {
    jest.resetModules();
    process.env = {
        AWS_REGION: 'us-east-1',
        DYNAMO_DB_TABLE: 'einthotel-booking-backend-dev-authorizer-api',
        ROLES_API_FUNC: 'einthotel-booking-backend-dev-roles-api',
    };
});

test('me', async () => {
    const func = require("../../src/authorizer-api");
    const body = JSON.stringify(
        {
        }
    )
    const event = {
        resource: '/auth/me',
        httpMethod: 'POST',
        headers: { 'appid': 'rGV2mQJW33tEdCUK1rQb9', 'locationid': 'KLIthGehuD4yUgDz58mDg' },
        body: Buffer.from(body).toString('base64'),
        requestContext: {
            authorizer: {
                principalId: 'dc246d8a-db7d-4a26-9b6b-f377eb77e5bf'
            }
        },
        pathParameters: {} };
    const acctual = await func.handler(event, {});
    console.log(acctual)
    expect(200).toEqual(acctual.statusCode);
}, 30000);