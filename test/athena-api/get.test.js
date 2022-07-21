beforeEach(() => {
    jest.resetModules();
    process.env = {
        AWS_REGION: 'us-east-1',
        DYNAMO_DB_TABLE: 'einthotel-booking-backend-dev-configs-api'
    };
});

test('query success', async () => {
    const func = require("../../src/athena-api");
    const body = JSON.stringify(
        {
            "queryString": "SELECT * FROM testdb.dim_answer;",
            "catalog": "target_db_demo_2",
            "database": "testdb",
            "outputLocation": "s3://athena-demo-test-1/query-results",
        }
    )
    const event = {
        resource: '/athena',
        httpMethod: 'POST',
        body: Buffer.from(body).toString('base64'),
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