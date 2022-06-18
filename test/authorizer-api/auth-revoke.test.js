beforeEach(() => {
    jest.resetModules();
    process.env = {
        AWS_REGION: 'us-east-1',
        DYNAMO_DB_TABLE: 'einthotel-booking-backend-dev-authorizer-api',
    };
});

test('revoke', async () => {
    const func = require("../../src/authorizer-api");
    const body = JSON.stringify(
        {
            "principleId": "17cc7717-ccfa-42d5-bf01-4484fe624ac1",
            "resourceId": "location/SdpZtPqwyEep4MkF9_uWb/IWDqlxoiXTjIA3yxujGUK"
        }
    )
    const event = {
        resource: '/auth/revoke',
        httpMethod: 'POST',
        body: Buffer.from(body).toString('base64'),
        pathParameters: {} };
    const acctual = await func.handler(event, {});
    console.log(acctual)
    expect(200).toEqual(acctual.statusCode);
}, 30000);