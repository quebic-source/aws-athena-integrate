const FunctionInvokerService = require('common-lib/service/function-invoker-service');
const {FUNCTIONS_REGISTRY} = require("../config/app-config");

class RoleService {
    constructor() {
        this.functionInvoker = new FunctionInvokerService();
    }

    async getById(roleId) {
        const resources = await this.functionInvoker.invokeAsHttp(
            FUNCTIONS_REGISTRY.ROLES_API_FUNC,
            {
                resource: `/roles/{roleId}`,
                httpMethod: "GET",
                pathParameters: { roleId }
            }
        );
        return resources.body;
    }
}

module.exports = RoleService;