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
const RoleService = require("./service/role-service");

const roleService = new RoleService();

const ID_PATH_PARAM = "{roleId}";
const RESOURCE_PATH = '/roles';

exports.handler = async function (event, context) {
    console.log("event", JSON.stringify(event));
    try {
        const resourcePath = event.resource;
        const httpMethod = event.httpMethod;

        if (resourcePath === RESOURCE_PATH && httpMethod === "GET") {

            return sendResponse(await roleService.getAll(preparePaginationRequest(event)));

        } else if (resourcePath === `${RESOURCE_PATH}/${ID_PATH_PARAM}` && httpMethod === "GET") {

            const {roleId} = getPathParams(event);
            return sendResponse(await roleService.getById(roleId));

        } else if (resourcePath === RESOURCE_PATH && httpMethod === "POST") {

            const request = getRequestBody(event);
            await roleService.create(request);
            return sendGeneralMessage('created', 201);

        } else if (resourcePath === `${RESOURCE_PATH}/${ID_PATH_PARAM}` && httpMethod === "PUT") {

            const {roleId} = getPathParams(event);
            const request = getRequestBody(event);
            request.id = roleId;
            await roleService.update(request);
            return sendGeneralMessage('updated');

        } else if (resourcePath === `${RESOURCE_PATH}/${ID_PATH_PARAM}` && httpMethod === "DELETE") {

            const {roleId} = getPathParams(event);
            await roleService.delete(roleId);
            return sendGeneralMessage('deleted');

        } else {
            throw new InvalidError(`invalid route ${resourcePath}:${httpMethod}`);
        }
    } catch (err) {
        console.error('handler execution failed', err);
        return sendError(err.message, err.code);
    }
}