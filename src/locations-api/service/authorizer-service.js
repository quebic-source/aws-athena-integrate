const FunctionInvokerService = require('common-lib/service/function-invoker-service');
const {FUNCTIONS_REGISTRY} = require("../config/app-config");

class AuthorizerService {
    constructor() {
        this.functionInvoker = new FunctionInvokerService();
    }

    async getAssociateResources(principleId, queryStringParameters = {}) {
        const resources = await this.functionInvoker.invokeAsHttp(
            FUNCTIONS_REGISTRY.AUTHORIZER_API_FUNC,
            {
                resource: "/auth/associate-resources",
                httpMethod: "GET",
                queryStringParameters: {
                    ...queryStringParameters,
                    principleId
                }
            }
        );
        return resources.body;
    }

    async assignResource(principleId, resourceId, role) {
        await this.functionInvoker.invokeAsHttp(
            FUNCTIONS_REGISTRY.AUTHORIZER_API_FUNC,
            {
                resource: "/auth/assign",
                httpMethod: "POST",
                body: {
                    principleId,
                    resourceId,
                    role,
                }
            }
        );
    }
}

module.exports = AuthorizerService;