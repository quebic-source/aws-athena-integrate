const  { TEST_USER_ID }  = require("../consts/common-consts");

beforeEach(() => {
    jest.resetModules();
    process.env = {
        AWS_REGION: 'us-east-1',
        DYNAMO_DB_TABLE: 'einthotel-booking-backend-dev-authorizer-api',
    };
});

test('is-authorized success', async () => {
    const func = require("../../src/authorizer-api");
    const body = JSON.stringify(
        {
            "principleId": "334ec67d-841c-4412-9333-8125089dd305",
            "resourceId": "593V4lCGDvk-bK_C8poe1/SyXBexrKPL7NScpE7Z1Gb"
        }
    )
    const event = {
        resource: '/auth/is-authorized',
        httpMethod: 'POST',
        body: Buffer.from(body).toString('base64'),
        pathParameters: {} };
    const acctual = await func.handler(event, {});
    console.log(acctual)
    expect(200).toEqual(acctual.statusCode);
}, 30000);


test('is-authorized fail', async () => {
    const func = require("../../src/authorizer-api");
    const body = JSON.stringify(
        {
            "principleId": "u1",
            "resourcePath": "/projects/1"
        }
    )
    const event = {
        resource: '/auth/is-authorized',
        httpMethod: 'POST',
        body: Buffer.from(body).toString('base64'),
        pathParameters: {} };
    const acctual = await func.handler(event, {});
    console.log(acctual)
    expect(403).toEqual(acctual.statusCode);
}, 30000);