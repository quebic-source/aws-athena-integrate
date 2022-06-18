const { DB_CONFIG } = require('../config/app-config');
const { ConfigCreateRequest } = require('../dto/request-dto');
const DynamoDBClient = require('common-lib/db/dynamo-db-client');
const { ResourceNotFoundError } = require('common-lib/exception');
const { Config } = require('../model/config-model');

const VAL_PLACE_HOLDER = `%VAL%`;
const ENTITY_PREFIX = 'config'
const PK = `${ENTITY_PREFIX}`;
const SK = `${ENTITY_PREFIX}-meta-data#${VAL_PLACE_HOLDER}`;

class ConfigDao {
    constructor() {
        this._dynamoDBClient = new DynamoDBClient({table: DB_CONFIG.DYNAMO_DB_TABLE });
    }

    async getById(id) {
        const resp = await this._dynamoDBClient.findByPKAndSK(this._getPk(), this._getSK(id));
        if (resp && resp.length > 0) {
            return new Config(resp[0]);
        } else {
            throw new ResourceNotFoundError(`role ${id} not found`);
        }
    }

    async getAll(pageRequest) {
        return await this._dynamoDBClient.findAllByPK(this._getPk(), pageRequest);
    }

    async create(request) {
        const dbRequest = new ConfigCreateRequest(request);
        await this._dynamoDBClient.create(
            this._getPk(),
            this._getSK(dbRequest.id),
            dbRequest)
        return dbRequest;
    }

    async update(request) {
        const dbRequest = new ConfigCreateRequest(request);
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

    _getPk() {
        return PK;
    }

    _getSK(id) {
        return SK.replace(VAL_PLACE_HOLDER, id);
    }
}

module.exports = ConfigDao;