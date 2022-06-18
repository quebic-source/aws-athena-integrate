const LocationDao = require('../dao/location-dao');

class LocationService {
    constructor() {
        this.dao = new LocationDao();
    }

    async getAllByIds(appId, ids) {
        return await this.dao.getAllByIds(appId, ids);
    }

    async getById(appId, locationId) {
        return await this.dao.getById(appId, locationId);
    }

    async create(request) {
        return await this.dao.create(request);
    }

    async update(request) {
        return await this.dao.update(request);
    }

    async delete(appId, locationId) {
        return await this.dao.delete(appId, locationId);
    }
}

module.exports = LocationService;