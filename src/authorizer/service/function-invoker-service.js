const {LambdaClient, InvokeCommand} = require("@aws-sdk/client-lambda");

// refer from common-lib/service/function-invoker-service
class FunctionInvokerService {
    constructor() {
        this.client = new LambdaClient();
    }

    async invokeAsHttp(functionName, {
        resource,
        httpMethod,
        pathParameters = {},
        queryStringParameters = {},
        body = {},
        headers = {}
    }) {
        const response = await this.invoke(functionName, {
            resource,
            httpMethod,
            pathParameters,
            queryStringParameters,
            body: Buffer.from(JSON.stringify(body)).toString('base64'),
            headers
        });
        response.body = JSON.parse(response.body);
        return response;
    }

    async invoke(functionName, payload) {
        console.time(`function-invoke ${functionName}`);
        const params = {
            FunctionName: functionName,
            Payload: JSON.stringify(payload)
        }
        const command = new InvokeCommand(params);
        const response = await this.client.send(command);
        const decodedResponse = new TextDecoder("utf-8").decode(response.Payload);
        console.timeEnd(`function-invoke ${functionName}`);
        return JSON.parse(decodedResponse);
    }
}

module.exports = FunctionInvokerService;