beforeEach(() => {
    jest.resetModules();
    process.env = {
        AWS_REGION: 'us-east-1',
        DYNAMO_DB_TABLE: 'einthotel-booking-backend-dev-apps-api',
        AUTHORIZER_API_FUNC: 'einthotel-booking-backend-dev-authorizer-api'
    };
});

test('list success', async () => {
    const func = require("../../src/apps-api");
    const body = JSON.stringify(
        {

        }
    )
    const event = {
        resource: '/apps',
        httpMethod: 'GET',
        body: Buffer.from(body).toString('base64'),
        pathParameters: {},
        requestContext: {
            authorizer: {
                principalId: '64c91817-e950-45f9-b43f-8373b5764a7d'
            }
        },
        queryStringParameters: {
            "pageSize":6,
            //"requestPage": "auth-resource#/apps/app/UbnwkzksTX0bGM25l0gQx"
        }
    };
    const acctual = await func.handler(event, {});
    console.log(acctual)
    expect(200).toEqual(acctual.statusCode);
}, 30000);