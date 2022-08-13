beforeEach(() => {
    jest.resetModules();
    process.env = {
        AWS_REGION: 'us-east-1',
        DYNAMO_DB_TABLE: 'aws-athena-integrate-dev-access-key'
    };
});

test('list', async () => {
    const func = require("../../src/access-key-api");
    const body = JSON.stringify({}
    )
    const event = {
        body: Buffer.from(body).toString('base64'),
        httpMethod: "GET",
        pathParameters: {},
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