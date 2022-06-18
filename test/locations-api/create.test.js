const  { TEST_USER_ID }  = require("../consts/common-consts");

beforeEach(() => {
    jest.resetModules();
    process.env = {
        AWS_REGION: 'us-east-1',
        DYNAMO_DB_TABLE: 'einthotel-booking-backend-dev-apps-api',
        AUTHORIZER_API_FUNC: 'einthotel-booking-backend-dev-authorizer-api'
    };
});

test('create success', async () => {
    const func = require("../../src/locations-api");
    const body = JSON.stringify(
        {
            "name": "loc-1",
        }
    )
    const event = {
        resource: '/locations',
        httpMethod: 'POST',
        body: Buffer.from(body).toString('base64'),
        pathParameters: {},
        headers: { appid: 'V9wqezI2tQRkTBgWF8pme' },
        requestContext: {
            authorizer: {
                principalId: TEST_USER_ID
            }
        }
    };
    const acctual = await func.handler(event, {});
    console.log(acctual)
    expect(acctual.statusCode).toEqual(201);
}, 30000);