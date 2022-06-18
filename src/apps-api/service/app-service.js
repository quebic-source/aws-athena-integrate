const AppDao = require('../dao/app-dao');

class AppService {
    constructor() {
        this.dao = new AppDao();
    }

    async getByAppId(id) {
        return await this.dao.getById(id);
    }

    async getAllByAppId(ids) {
        return await this.dao.getAllByIds(ids);
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

module.exports = AppService;