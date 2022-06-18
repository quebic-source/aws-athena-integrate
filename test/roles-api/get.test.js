beforeEach(() => {
    jest.resetModules();
    process.env = {
        AWS_REGION: 'us-east-1',
        DYNAMO_DB_TABLE: 'einthotel-booking-backend-dev-roles-api'
    };
});

test('get success', async () => {
    const func = require("../../src/roles-api");
    const body = JSON.stringify(
        {

        }
    )
    const event = {
        resource: '/roles/{roleId}',
        httpMethod: 'GET',
        body: Buffer.from(body).toString('base64'),
        pathParameters: {roleId: 'admin'},
        requestContext: {
            authorizer: {
                principalId: 'u1'
            }
        }
    };
    const acctual = await func.handler(event, {});
    console.log(acctual)
    expect(200).toEqual(acctual.statusCode);
}, 30000);