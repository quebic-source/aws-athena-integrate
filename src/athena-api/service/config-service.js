const ConfigDao = require('../dao/config-dao');
const {ConfigResponse} = require("../dto/response-dto");

class ConfigService {
    constructor() {
        this.dao = new ConfigDao();
    }

    async getById(id) {
        return this.mapToResponseDto(await this.dao.getById(id));
    }

    async getAll(pageRequest) {
        return this.mapListToResponseDto(await this.dao.getAll(pageRequest));
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

    mapListToResponseDto(response= { data: []}) {
        response.data = response.data.map(d => this.mapToResponseDto(d));
        return response;
    }

    mapToResponseDto(d = {}) {
        return new ConfigResponse(d);
    }
}

module.exports = ConfigService;