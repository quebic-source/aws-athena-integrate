const AuthDao = require('../dao/auth-dao');
const RoleService = require('./role-service');

class AuthService {
    constructor() {
        this.dao = new AuthDao();
        this.roleService = new RoleService();
    }

    async isAuthorized(principleId, resourcePath) {
        return await this.dao.getByPrincipleIdAndResourcePathPrefix(principleId, resourcePath);
    }

    async currentUser(principleId, resourcePath) {
        const principle = await this.dao.getByPKAndSK(principleId, resourcePath);
        if (principle) {
            const roleResp = await this.roleService.getById(principle.role);
            principle.permissions = roleResp.permissions;
            return principle;
        } else {
            return null;
        }
    }

    async getAssociateResources(principleId, resourcePathPrefix, pageRequest) {
        return await this.dao.getByPrincipleIdAndResourcePathPrefix(principleId, resourcePathPrefix, pageRequest);
    }

    async getAssociateUsers(resourcePath) {
        return await this.dao.getByResourcePath(resourcePath);
    }

    async assign(request) {
        return await this.dao.create(request);
    }

    async revoke(request) {
        return await this.dao.delete(request);
    }
}

module.exports = AuthService;