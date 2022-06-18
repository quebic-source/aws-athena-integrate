const RateDao = require('../dao/rate-dao');
const {RateResponse} = require("../dto/response-dto");

class RateService {
    constructor() {
        this.dao = new RateDao();
    }

    async getAllByAppId(appId, pageRequest) {
        return this.mapListToResponseDto(await this.dao.getAllByAppId(appId, pageRequest));
    }

    async getById(appId, id) {
        return this.mapToResponseDto(await this.dao.getById(appId, id));
    }

    async create(request) {
        return await this.dao.create(request);
    }

    async update(request) {
        return await this.dao.update(request);
    }

    async delete(appId, id) {
        return await this.dao.delete(appId, id);
    }

    mapListToResponseDto(response= { data: []}) {
        response.data = response.data.map(d => this.mapToResponseDto(d));
        return response;
    }

    mapToResponseDto(d = {}) {
        return new RateResponse(d);
    }
}

module.exports = RateService;