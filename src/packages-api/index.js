const {
    sendError,
    sendResponse,
    getRequestBody,
    getPathParams,
    getAppIdFromEvent,
    sendGeneralMessage
} = require("common-lib/utils/http-utils");
const { InvalidError } = require('common-lib/exception');
const {
    preparePaginationRequest
} = require("common-lib/utils/pagination-utils");
const PackageService = require("./service/package-service");

const service = new PackageService();

const ID_PATH_PARAM = "{packageId}";
const RESOURCE_PATH = '/packages';
const RESOURCE_ID_PATH = `${RESOURCE_PATH}/${ID_PATH_PARAM}`;

exports.handler = async function (event, context) {
    console.log("event", JSON.stringify(event));
    try {
        const resourcePath = event.resource;
        const httpMethod = event.httpMethod;
        const appId = getAppIdFromEvent(event);
        if (resourcePath === RESOURCE_PATH && httpMethod === "GET") {

            return sendResponse(await service.getAllByAppId(appId, preparePaginationRequest(event)));

        } else if (resourcePath === RESOURCE_ID_PATH && httpMethod === "GET") {

            const {packageId} = getPathParams(event);
            return sendResponse(await service.getById(appId, packageId));

        } else if (resourcePath === RESOURCE_PATH && httpMethod === "POST") {

            const request = getRequestBody(event);
            request.appId = appId;
            const savedProject = await service.create(request);

            return sendResponse({ 'id': savedProject.id }, 201);

        } else if (resourcePath === RESOURCE_ID_PATH && httpMethod === "PUT") {

            const {packageId} = getPathParams(event);
            const request = getRequestBody(event);
            request.appId = appId;
            request.id = packageId;
            await service.update(request);
            return sendGeneralMessage('updated');

        } else if (resourcePath === RESOURCE_ID_PATH && httpMethod === "DELETE") {

            const {packageId} = getPathParams(event);
            await service.delete(appId, packageId);
            return sendGeneralMessage('deleted');

        } else {
            throw new InvalidError(`invalid route ${resourcePath}:${httpMethod}`);
        }
    } catch (err) {
        console.error('handler execution failed', err);
        return sendError(err.message, err.code);
    }
}