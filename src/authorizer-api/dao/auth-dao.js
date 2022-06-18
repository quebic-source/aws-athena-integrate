const { DB_CONFIG } = require('../config/app-config');
const DynamoDBClient = require('common-lib/db/dynamo-db-client');
const { createUniqueId } = require('common-lib/utils/object-utils');
const {AuthCreateRequest} = require("../dto/request-dto");

const VAL_PLACE_HOLDER = `%VAL%`;
const ENTITY_PREFIX = 'auth'
const PK = `${ENTITY_PREFIX}-principle#${VAL_PLACE_HOLDER}`;
const SK = `${ENTITY_PREFIX}-resource#${VAL_PLACE_HOLDER}`;

class AuthDao {
    constructor() {
        this._dynamoDBClient = new DynamoDBClient({table: DB_CONFIG.DYNAMO_DB_TABLE });
    }

    async getByPKAndSK(principleId, resourcePath) {
        const resp = await this._dynamoDBClient
            .findByPKAndSK(this._getPk(principleId), this._getSK(resourcePath));
        if (resp && resp.length > 0) {
            return resp[0];
        } else {
            return null;
        }
    }

    async getByPrincipleIdAndResourcePathPrefix(principleId, resourcePathPrefix, pageRequest) {
        const sk = this._getSK(resourcePathPrefix);
        return await this._dynamoDBClient
            .findByPKAndBeginsWithSK(this._getPk(principleId), sk, pageRequest);
    }

    async getByResourcePath(resourcePath) {
        const sk = this._getSK(resourcePath);
        return await this._dynamoDBClient.findAllByPKWithCustomIndex('sk', sk, 'resource-principle-index')
    }

    async create(request) {
        const dbRequest = new AuthCreateRequest(request);
        await this._dynamoDBClient.create(
            this._getPk(dbRequest.principleId),
            this._getSK(dbRequest.resourcePath),
            dbRequest)
        return dbRequest;
    }

    async delete({principleId, resourcePath}) {
        await this._dynamoDBClient.deleteByPKAndSK(
            this._getPk(principleId),
            this._getSK(resourcePath))
    }

    _getPk(principleId) {
        return PK.replace(VAL_PLACE_HOLDER, principleId);
    }

    _getSK(resourcePath) {
        return SK.replace(VAL_PLACE_HOLDER, resourcePath);
    }
}

module.exports = AuthDao;