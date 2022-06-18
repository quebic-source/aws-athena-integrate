beforeEach(() => {
    jest.resetModules();
    process.env = {
        AWS_REGION: 'us-east-1',
        DYNAMO_DB_TABLE: 'einthotel-booking-backend-dev-users-api'
    };
});

test('search by email', async () => {
    const func = require("../../src/users-api");
    const body = JSON.stringify(
        {

        }
    )
    const event = {
        resource: '/users/search',
        httpMethod: 'GET',
        body: Buffer.from(body).toString('base64'),
        pathParameters: {},
        queryStringParameters: { email: "tharanganilupul@gmail.com"},
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