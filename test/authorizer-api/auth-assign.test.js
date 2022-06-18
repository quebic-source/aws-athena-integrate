beforeEach(() => {
    jest.resetModules();
    process.env = {
        AWS_REGION: 'us-east-1',
        DYNAMO_DB_TABLE: 'einthotel-booking-backend-dev-authorizer-api',
    };
});

test('associate', async () => {
    const func = require("../../src/authorizer-api");
    const body = JSON.stringify(
        {
            "principleId": "u1",
            "resourcePath": "/apps/1111",
            "resourceId": "1111",
        }
    )
    const event = {
        resource: '/auth/assign',
        httpMethod: 'POST',
        body: Buffer.from(body).toString('base64'),
        pathParameters: {} };
    const acctual = await func.handler(event, {});
    console.log(acctual)
    expect(200).toEqual(acctual.statusCode);
}, 30000);