const { DB_CONFIG } = require('../config/app-config');
const { LocationCreateRequest } = require('../dto/request-dto');
const DynamoDBClient = require('common-lib/db/dynamo-db-client');
const {
    APP_ID_PLACE_HOLDER,
    LOCATION_PLACE_HOLDER } = require('common-lib/consts/dynamo-db-const');
const { createUniqueId } = require('common-lib/utils/object-utils');
const { ResourceNotFoundError } = require('common-lib/exception');
const { Location } = require('../model/location-model');

const ENTITY_PREFIX = 'location'
const PK = `${ENTITY_PREFIX}#${APP_ID_PLACE_HOLDER}`;
const SK = `${ENTITY_PREFIX}-meta-data#${LOCATION_PLACE_HOLDER}`;

class LocationDao {
    constructor() {
        this._dynamoDBClient = new DynamoDBClient({table: DB_CONFIG.DYNAMO_DB_TABLE });
    }

    async getById(appId, locationId) {
        const response = await this._dynamoDBClient.findByPKAndSK(this._getPk(appId), this._getSK(locationId));
        if (response && response.length > 0) {
            return new Location(response[0]);
        } else {
            throw new ResourceNotFoundError(`app ${appId} location ${locationId} not found`);
        }
    }

    async getAllByIds(appId, ids) {
        const locations = [];
        for (const idO of ids) {
            try {
                locations.push(await this.getById(appId, idO.locationId));
            } catch (e) {
                console.warn("location not found", appId, idO.locationId);
            }
        }
        return locations;
    }

    async create(request) {
        const dbRequest = new LocationCreateRequest(request);
        dbRequest.id = createUniqueId();
        await this._dynamoDBClient.create(
            this._getPk(dbRequest.appId),
            this._getSK(dbRequest.id),
            dbRequest)
        return dbRequest;
    }

    async update(request) {
        const dbRequest = new LocationCreateRequest(request);
        const savedProject = await this.getById(dbRequest.appId, dbRequest.id);
        const newData = {
            ...savedProject,
            ...dbRequest
        };
        await this._dynamoDBClient.update(
            savedProject.pk,
            savedProject.sk,
            newData)
    }

    async delete(appId, locationId) {
        const savedProject = await this.getById(appId, locationId);
        await this._dynamoDBClient.deleteByPKAndSK(
            savedProject.pk,
            savedProject.sk)
    }

    _getPk(appId) {
        return PK.replace(APP_ID_PLACE_HOLDER, appId);
    }

    _getSK(locationId) {
        return SK.replace(LOCATION_PLACE_HOLDER, locationId);
    }
}

module.exports = LocationDao;