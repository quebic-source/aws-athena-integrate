const FunctionInvokerService = require('common-lib/service/function-invoker-service');
const {FUNCTIONS_REGISTRY} = require("../config/app-config");

class UserService {
    constructor() {
        this.functionInvoker = new FunctionInvokerService();
    }

    async getById(userId) {
        const resources = await this.functionInvoker.invokeAsHttp(
            FUNCTIONS_REGISTRY.USERS_API_FUNC,
            {
                resource: `/users/{userId}`,
                httpMethod: "GET",
                pathParameters: { userId }
            }
        );
        return resources.body;
    }
}

module.exports = UserService;