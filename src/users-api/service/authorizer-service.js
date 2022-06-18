const FunctionInvokerService = require('common-lib/service/function-invoker-service');
const {FUNCTIONS_REGISTRY} = require("../config/app-config");

class AuthorizerService {
    constructor() {
        this.functionInvoker = new FunctionInvokerService();
    }

    async getAssociateResources(userId, resourcePathPrefix, queryStringParameters = {}) {
        const resources = await this.functionInvoker.invokeAsHttp(
            FUNCTIONS_REGISTRY.AUTHORIZER_API_FUNC,
            {
                resource: "/auth/associate-resources",
                httpMethod: "GET",
                queryStringParameters: {
                    ...queryStringParameters,
                    userId,
                    resourcePathPrefix
                }
            }
        );
        return resources.body;
    }

    async getAssociateUsers(resourcePath, queryStringParameters = {}) {
        const resources = await this.functionInvoker.invokeAsHttp(
            FUNCTIONS_REGISTRY.AUTHORIZER_API_FUNC,
            {
                resource: "/auth/associate-users",
                httpMethod: "GET",
                queryStringParameters: {
                    ...queryStringParameters,
                    resourcePath
                }
            }
        );
        return resources.body;
    }

    async assignResource(userId, resourcePath, resourceId) {
        await this.functionInvoker.invokeAsHttp(
            FUNCTIONS_REGISTRY.AUTHORIZER_API_FUNC,
            {
                resource: "/auth/assign",
                httpMethod: "POST",
                body: {
                    userId,
                    resourcePath,
                    resourceId
                }
            }
        );
    }
}

module.exports = AuthorizerService;