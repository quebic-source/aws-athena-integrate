const {
    sendError,
    sendResponse,
    getRequestBody,
    getPathParams,
    getQueryStringParameters,
    getUserIdFromEvent,
    sendGeneralMessage
} = require("common-lib/utils/http-utils");
const {
    APPS_RESOURCE_PATH,
    APPS_ID_RESOURCE_PATH,
    AUTH_APP_RESOURCE_PATH
} = require("common-lib/consts/api-const");
const {
    ADMIN_ROLE
} = require("common-lib/consts/roles-const");
const { InvalidError } = require('common-lib/exception');
const AppService = require("./service/app-service");
const AuthorizerService = require("./service/authorizer-service");

const appService = new AppService();
const authorizerService = new AuthorizerService();

const setAdmin = (authResources, apps) => {
    const rolesByApp = authResources.data.reduce((map, currentVal)=>{
        map[`${currentVal.resourceId.replace(`${AUTH_APP_RESOURCE_PATH}${AUTH_RESOURCE_ID_SEP}`, '')}`] = currentVal.role;
        return map;
    }, {});
    for (const app of apps.data) {
        app.isAdmin = ADMIN_ROLE === rolesByApp[app.id];
    }
}
const AUTH_RESOURCE_ID_SEP = '/';
exports.handler = async function (event, context) {
    console.log("event", JSON.stringify(event));
    try {
        const resourcePath = event.resource;
        const httpMethod = event.httpMethod;

        if (resourcePath === APPS_RESOURCE_PATH && httpMethod === "GET") {

            const queryParams = getQueryStringParameters(event);
            queryParams.resourcePathPrefix = `${AUTH_APP_RESOURCE_PATH}${AUTH_RESOURCE_ID_SEP}`;
            const resourcesResp = await authorizerService.getAssociateResources(
                getUserIdFromEvent(event), queryParams);
            const appIds = new Set(resourcesResp.data.map(resource => resource.resourceId.replace(queryParams.resourcePathPrefix, '')));

            const appsResp = {...resourcesResp};
            appsResp.data = await appService.getAllByAppId(appIds);
            setAdmin(resourcesResp, appsResp);
            return sendResponse(appsResp);

        } else if (resourcePath === APPS_ID_RESOURCE_PATH && httpMethod === "GET") {

            const {appId} = getPathParams(event);
            return sendResponse(await appService.getByAppId(appId));

        } else if (resourcePath === APPS_RESOURCE_PATH && httpMethod === "POST") {

            const request = getRequestBody(event);
            const savedProject = await appService.create(request);
            await authorizerService.assignResource(
                getUserIdFromEvent(event),
                `${AUTH_APP_RESOURCE_PATH}${AUTH_RESOURCE_ID_SEP}${savedProject.id}`,
                ADMIN_ROLE // app creator by default become admin
                )
            return sendResponse({ 'id': savedProject.id }, 201);

        } else if (resourcePath === APPS_ID_RESOURCE_PATH && httpMethod === "PUT") {

            const {appId} = getPathParams(event);
            const request = getRequestBody(event);
            request.id = appId;
            await appService.update(request);
            return sendGeneralMessage('updated');

        } else if (resourcePath === APPS_ID_RESOURCE_PATH && httpMethod === "DELETE") {

            const {appId} = getPathParams(event);
            await appService.delete(appId);
            return sendGeneralMessage('deleted');

        } else {
            throw new InvalidError(`invalid route ${resourcePath}:${httpMethod}`);
        }
    } catch (err) {
        console.error('handler execution failed', err);
        return sendError(err.message, err.code);
    }
}