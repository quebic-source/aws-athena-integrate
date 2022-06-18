const { DB_CONFIG } = require('../config/app-config');
const { AppCreateRequest } = require('../dto/request-dto');
const DynamoDBClient = require('common-lib/db/dynamo-db-client');
const { createUniqueId } = require('common-lib/utils/object-utils');
const { ResourceNotFoundError } = require('common-lib/exception');
const { App } = require('../model/app-model');

const VAL_PLACE_HOLDER = `%VAL%`;
const ENTITY_PREFIX = 'app'
const PK = `${ENTITY_PREFIX}#${VAL_PLACE_HOLDER}`;
const SK = `${ENTITY_PREFIX}-meta-data#${VAL_PLACE_HOLDER}`;

class AppDao {
    constructor() {
        this._dynamoDBClient = new DynamoDBClient({table: DB_CONFIG.DYNAMO_DB_TABLE });
    }

    async getById(id) {
        const { data } = await this._dynamoDBClient.findAllByPK(this._getPk(id));
        if (data && data.length > 0) {
            return new App(data[0]);
        } else {
            throw new ResourceNotFoundError(`app ${id} not found`);
        }
    }

    async getAllByIds(ids) {
        const projects = [];
        for (const id of ids) {
            try {
                projects.push(await this.getById(id));
            } catch (e) {
                console.warn("app not found", id);
            }
        }
        return projects;
    }

    async create(request) {
        const dbRequest = new AppCreateRequest(request);
        dbRequest.id = createUniqueId();
        await this._dynamoDBClient.create(
            this._getPk(dbRequest.id),
            this._getSK(dbRequest.name),
            dbRequest)
        return dbRequest;
    }

    async update(request) {
        const dbRequest = new AppCreateRequest(request);
        const savedProject = await this.getById(dbRequest.id);
        const newData = {
            ...savedProject,
            ...dbRequest
        };
        await this._dynamoDBClient.update(
            savedProject.pk,
            savedProject.sk,
            newData)
    }

    async delete(id) {
        const savedProject = await this.getById(id);
        await this._dynamoDBClient.deleteByPKAndSK(
            savedProject.pk,
            savedProject.sk)
    }

    _getPk(id) {
        return PK.replace(VAL_PLACE_HOLDER, id);
    }

    _getSK(name) {
        return SK.replace(VAL_PLACE_HOLDER, name);
    }
}

module.exports = AppDao;