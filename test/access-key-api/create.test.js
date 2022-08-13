beforeEach(() => {
    jest.resetModules();
    process.env = {
        AWS_REGION: 'us-east-1',
        DYNAMO_DB_TABLE: 'aws-athena-integrate-dev-access-key',
        ACCESS_KEY_PREFIX: 'athena-demo',
        ACCESS_KEY_SECRET: '1qaz2wsx'
    };
});

test('create', async () => {
    const func = require("../../src/access-key-api");
    const body = JSON.stringify(
        {
            "customerId": "ecma_1",
        }
    )
    const event = {
        body: Buffer.from(body).toString('base64'),
        pathParameters: {},
        httpMethod: "POST",
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