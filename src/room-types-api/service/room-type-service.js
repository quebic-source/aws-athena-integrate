const RoomDao = require('../dao/room-dao');
const {RoomTypeResponse} = require("../dto/response-dto");

class RoomTypeService {
    constructor() {
        this.dao = new RoomDao();
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
        return new RoomTypeResponse(d);
    }
}

module.exports = RoomTypeService;