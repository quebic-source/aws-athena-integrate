const RoleDao = require('../dao/role-dao');

class RoleService {
    constructor() {
        this.dao = new RoleDao();
    }

    async getById(id) {
        return await this.dao.getById(id);
    }

    async getAll(pageRequest) {
        return await this.dao.getAll(pageRequest);
    }

    async create(request) {
        return await this.dao.create(request);
    }

    async update(request) {
        return await this.dao.update(request);
    }

    async delete(id) {
        return await this.dao.delete(id);
    }
}

module.exports = RoleService;