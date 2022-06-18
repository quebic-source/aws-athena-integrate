const FunctionInvokerService = require('./function-invoker-service');
const {FUNCTIONS_REGISTRY} = require("../config/app-config");

class AuthorizerService {
    constructor() {
        this.functionInvokerService = new FunctionInvokerService();
    }

    async isAuthorized(userId, resourceId) {
        const resp = await this.functionInvokerService.invokeAsHttp(
            FUNCTIONS_REGISTRY.AUTHORIZER_API_FUNC,
            {
                resource: "/auth/is-authorized",
                httpMethod: "POST",
                body: {
                    principleId: userId,
                    resourceId
                }
            }
        );
        if (resp.statusCode !== 200) {
            throw new Error("UnAuthorized Access")
        }
    }
}

module.exports = AuthorizerService;