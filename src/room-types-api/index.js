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
const RoomTypeService = require("./service/room-type-service");

const service = new RoomTypeService();

const ID_PATH_PARAM = "{roomTypeId}";
const RESOURCE_PATH = '/room-types';
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

            const {roomTypeId} = getPathParams(event);
            return sendResponse(await service.getById(appId, roomTypeId));

        } else if (resourcePath === RESOURCE_PATH && httpMethod === "POST") {

            const request = getRequestBody(event);
            request.appId = appId;
            const savedProject = await service.create(request);

            return sendResponse({ 'id': savedProject.id }, 201);

        } else if (resourcePath === RESOURCE_ID_PATH && httpMethod === "PUT") {

            const {roomTypeId} = getPathParams(event);
            const request = getRequestBody(event);
            request.appId = appId;
            request.id = roomTypeId;
            await service.update(request);
            return sendGeneralMessage('updated');

        } else if (resourcePath === RESOURCE_ID_PATH && httpMethod === "DELETE") {

            const {roomTypeId} = getPathParams(event);
            await service.delete(appId, roomTypeId);
            return sendGeneralMessage('deleted');

        } else {
            throw new InvalidError(`invalid route ${resourcePath}:${httpMethod}`);
        }
    } catch (err) {
        console.error('handler execution failed', err);
        return sendError(err.message, err.code);
    }
}