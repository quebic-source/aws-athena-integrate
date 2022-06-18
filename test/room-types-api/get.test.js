const  { TEST_USER_ID }  = require("../consts/common-consts");

beforeEach(() => {
    jest.resetModules();
    process.env = {
        AWS_REGION: 'us-east-1',
        DYNAMO_DB_TABLE: 'einthotel-booking-backend-dev-room-types-api-db',
        AUTHORIZER_API_FUNC: 'einthotel-booking-backend-dev-authorizer-api'
    };
});

test('get success', async () => {
    const func = require("../../src/room-types-api");
    const body = JSON.stringify(
        {

        }
    )
    const event = {
        resource: '/room-types/{roomTypeId}',
        httpMethod: 'GET',
        body: Buffer.from(body).toString('base64'),
        pathParameters: { appId: "TewiuzHRfT-PvzEzU6V4F", "roomTypeId": "fFj_VOC4Derda9HktV1ty" },
        requestContext: {
            authorizer: {
                principalId: '0ab19dc7-7092-4854-95fd-c3a8959023ec'
            }
        }
    };
    const acctual = await func.handler(event, {});
    console.log(acctual)
    expect(acctual.statusCode).toEqual(200);
}, 30000);


test('get not found', async () => {
    const func = require("../../src/apps-api");
    const body = JSON.stringify(
        {

        }
    )
    const event = {
        resource: '/apps/{appId}',
        httpMethod: 'GET',
        body: Buffer.from(body).toString('base64'),
        pathParameters: { appId: "1" },
        requestContext: {
            authorizer: {
                principalId: '0ab19dc7-7092-4854-95fd-c3a8959023ec'
            }
        }
    };
    const acctual = await func.handler(event, {});
    console.log(acctual)
    expect(acctual.statusCode).toEqual(404);
}, 30000);