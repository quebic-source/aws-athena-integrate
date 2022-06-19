const {
    sendError,
    sendResponse,
    getRequestBody,
    getPathParams,
    sendGeneralMessage
} = require("common-lib/utils/http-utils");
const {
    preparePaginationRequest
} = require("common-lib/utils/pagination-utils");
const { InvalidError } = require('common-lib/exception');
const { AthenaClient, StartQueryExecutionCommand }  = require("@aws-sdk/client-athena"); //
const RESOURCE_PATH = '/athena';

const athenaClient = new AthenaClient();

exports.handler = async function (event, context) {
    console.log("event", JSON.stringify(event));
    try {
        const resourcePath = event.resource;
        const httpMethod = event.httpMethod;

        if (resourcePath === RESOURCE_PATH && httpMethod === "GET") {
            const command = new StartQueryExecutionCommand({
                "QueryString": "SELECT * FROM testdb.dim_answer;",
                QueryExecutionContext: {
                    Catalog: "target_db_demo_2",
                    Database: "testdb"
                },
                ResultConfiguration: {
                    OutputLocation: "s3://athena-demo-test-1/query-results"
                }
            });
            const response = await athenaClient.send(command);
            return sendResponse(response);

        } else {
            throw new InvalidError(`invalid route ${resourcePath}:${httpMethod}`);
        }
    } catch (err) {
        console.error('handler execution failed', err);
        return sendError(err.message, err.code);
    }
}