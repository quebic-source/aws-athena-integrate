const UserDao = require('../dao/user-dao');
const {UserResponse} = require("../dto/response-dto");
class UserService {
    constructor() {
        this.dao = new UserDao();
    }

    async getById(id) {
        return this.mapToResponseDto(await this.dao.getById(id));
    }

    async getAllByEmail(email, pageRequest) {
        return this.mapListToResponseDto(await this.dao.getAllByEmail(email, pageRequest));
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
        return new UserResponse(d);
    }
}

module.exports = UserService;