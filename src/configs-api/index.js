const {
    sendError,
    sendResponse,
    getRequestBody,
    getPathParams,
    sendGeneralMessage
} = require("common-lib/utils/http-utils");
const {
    preparePaginationRequest
} = require("common-lib/utils/pagination-utils");
const { InvalidError } = require('common-lib/exception');
const ConfigService = require("./service/config-service");

const service = new ConfigService();

const ID_PATH_PARAM = "{configId}";
const RESOURCE_PATH = '/configs';

exports.handler = async function (event, context) {
    console.log("event", JSON.stringify(event));
    try {
        const resourcePath = event.resource;
        const httpMethod = event.httpMethod;

        if (resourcePath === RESOURCE_PATH && httpMethod === "GET") {

            return sendResponse(await service.getAll(preparePaginationRequest(event)));

        } else if (resourcePath === `${RESOURCE_PATH}/${ID_PATH_PARAM}` && httpMethod === "GET") {

            const {configId} = getPathParams(event);
            return sendResponse(await service.getById(configId));

        } else if (resourcePath === RESOURCE_PATH && httpMethod === "POST") {

            const request = getRequestBody(event);
            await service.create(request);
            return sendGeneralMessage('created', 201);

        } else if (resourcePath === `${RESOURCE_PATH}/${ID_PATH_PARAM}` && httpMethod === "PUT") {

            const {configId} = getPathParams(event);
            const request = getRequestBody(event);
            request.id = configId;
            await service.update(request);
            return sendGeneralMessage('updated');

        } else if (resourcePath === `${RESOURCE_PATH}/${ID_PATH_PARAM}` && httpMethod === "DELETE") {

            const {configId} = getPathParams(event);
            await service.delete(configId);
            return sendGeneralMessage('deleted');

        } else {
            throw new InvalidError(`invalid route ${resourcePath}:${httpMethod}`);
        }
    } catch (err) {
        console.error('handler execution failed', err);
        return sendError(err.message, err.code);
    }
}