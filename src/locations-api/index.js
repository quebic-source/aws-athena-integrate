const {
    sendError,
    sendResponse,
    getRequestBody,
    getPathParams,
    getQueryStringParameters,
    getUserIdFromEvent,
    getAppIdFromEvent,
    sendGeneralMessage
} = require("common-lib/utils/http-utils");
const {
    APPS_RESOURCE_PATH,
    APPS_ID_RESOURCE_PATH,
    AUTH_LOCATION_RESOURCE_PATH
} = require("common-lib/consts/api-const");
const {
    ADMIN_ROLE
} = require("common-lib/consts/roles-const");
const { InvalidError } = require('common-lib/exception');
const LocationService = require("./service/location-service");
const AuthorizerService = require("./service/authorizer-service");

const locationService = new LocationService();
const authorizerService = new AuthorizerService();

const ID_PATH_PARAM = "{locationId}";
const RESOURCE_PATH = '/locations';
const RESOURCE_ID_PATH = `${RESOURCE_PATH}/${ID_PATH_PARAM}`;
const AUTH_RESOURCE_ID_SEP = '/';
exports.handler = async function (event, context) {
    console.log("event", JSON.stringify(event));
    try {
        const resourcePath = event.resource;
        const httpMethod = event.httpMethod;
        const appId = getAppIdFromEvent(event);
        if (resourcePath === RESOURCE_PATH && httpMethod === "GET") {

            const queryParams = getQueryStringParameters(event);
            queryParams.resourcePathPrefix = `${AUTH_LOCATION_RESOURCE_PATH}${AUTH_RESOURCE_ID_SEP}${appId}`;

            const resourcesResp = await authorizerService.getAssociateResources(
                getUserIdFromEvent(event), queryParams);
            const ids = resourcesResp.data.map(resource => {
                const resourceIdSplits = resource.resourceId
                    .replace(`${AUTH_LOCATION_RESOURCE_PATH}${AUTH_RESOURCE_ID_SEP}`, '')
                    .split(AUTH_RESOURCE_ID_SEP);
                return { appId: resourceIdSplits[0], locationId: resourceIdSplits[1] };
            });
            resourcesResp.data = await locationService.getAllByIds(appId, ids);
            return sendResponse(resourcesResp);

        } else if (resourcePath === RESOURCE_ID_PATH && httpMethod === "GET") {

            const {locationId} = getPathParams(event);
            return sendResponse(await locationService.getById(appId, locationId));

        } else if (resourcePath === RESOURCE_PATH && httpMethod === "POST") {

            const request = getRequestBody(event);
            request.appId = appId;
            const savedProject = await locationService.create(request);
            await authorizerService.assignResource(
                getUserIdFromEvent(event),
                `${AUTH_LOCATION_RESOURCE_PATH}${AUTH_RESOURCE_ID_SEP}${savedProject.appId}${AUTH_RESOURCE_ID_SEP}${savedProject.id}`,
                ADMIN_ROLE // app creator by default become admin
                )

            return sendResponse({ 'id': savedProject.id }, 201);

        } else if (resourcePath === RESOURCE_ID_PATH && httpMethod === "PUT") {

            const {locationId} = getPathParams(event);
            const request = getRequestBody(event);
            request.appId = appId;
            request.id = locationId;
            await locationService.update(request);
            return sendGeneralMessage('updated');

        } else if (resourcePath === RESOURCE_ID_PATH && httpMethod === "DELETE") {

            const {locationId} = getPathParams(event);
            await locationService.delete(appId, locationId);
            return sendGeneralMessage('deleted');

        } else {
            throw new InvalidError(`invalid route ${resourcePath}:${httpMethod}`);
        }
    } catch (err) {
        console.error('handler execution failed', err);
        return sendError(err.message, err.code);
    }
}