const  { TEST_USER_ID }  = require("../consts/common-consts");

beforeEach(() => {
    jest.resetModules();
    process.env = {
        AWS_REGION: 'us-east-1',
        DYNAMO_DB_TABLE: 'einthotel-booking-backend-dev-room-types-api-db',
        AUTHORIZER_API_FUNC: 'einthotel-booking-backend-dev-authorizer-api'
    };
});

test('list success', async () => {
    const func = require("../../src/room-types-api");
    const body = JSON.stringify(
        {

        }
    )
    const event = {
        resource: '/room-types',
        httpMethod: 'GET',
        body: Buffer.from(body).toString('base64'),
        pathParameters: {},
        headers: { appid: 'TewiuzHRfT-PvzEzU6V4F' },
        requestContext: {
            authorizer: {
                principalId: '334ec67d-841c-4412-9333-8125089dd305'
            }
        }
    };
    const acctual = await func.handler(event, {});
    console.log(acctual)
    expect(200).toEqual(acctual.statusCode);
}, 30000);