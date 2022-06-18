const { sendError, sendResponse, getRequestBody, getUserIdFromEvent, getAppIdLocationIdFromEvent, sendGeneralMessage, getQueryStringParameters } = require("common-lib/utils/http-utils");
const { APPS_RESOURCE_PATH } = require("common-lib/consts/api-const");
const { InvalidError, UnauthorizedAccessError } = require("common-lib/exception");
const {
    preparePaginationRequest
} = require("common-lib/utils/pagination-utils");
const {
    AUTH_LOCATION_RESOURCE_PATH
} = require("common-lib/consts/api-const");

const AuthService = require("./service/auth-service");
const UserService = require("./service/user-service");

const service = new AuthService();
const userService = new UserService();

const AUTH_RESOURCE_ID_SEP = '/';
exports.handler = async function (event, context) {
    console.log("event", JSON.stringify(event));
    try {
        const resourcePath = event.resource;
        const httpMethod = event.httpMethod;

        if (resourcePath === "/auth/is-authorized" && httpMethod === "POST") {

            const { principleId, resourceId } = getRequestBody(event);
            const resourcePath = `${APPS_RESOURCE_PATH}/${resourceId}`;
            const res = await service.isAuthorized(principleId, resourcePath);
            if (res && res.data && res.data.length > 0) {
                return sendGeneralMessage('authorized');
            } else {
                throw new UnauthorizedAccessError(`userId: ${principleId}, resource: ${resourcePath}`);
            }

        } else if (resourcePath === "/auth/assign" && httpMethod === "POST") {

            const request = getRequestBody(event);
            request.resourcePath = `${APPS_RESOURCE_PATH}/${request.resourceId}`;
            await service.assign(request);

            // TODO
            // save app
            const appId = request.resourceId.split("/")[1];
            request.resourceId = `app/${appId}`;
            request.resourcePath = `${APPS_RESOURCE_PATH}/app/${appId}`;
            await service.assign(request);

            return sendGeneralMessage('assigned');

        } else if (resourcePath === "/auth/revoke" && httpMethod === "POST") {

            const request = getRequestBody(event);
            request.resourcePath = `${APPS_RESOURCE_PATH}/${request.resourceId}`;
            await service.revoke(request);

            // TODO
            // app
            const appId = request.resourceId.split("/")[1];
            request.resourceId = `app/${appId}`;
            request.resourcePath = `${APPS_RESOURCE_PATH}/app/${appId}`;
            await service.revoke(request);

            return sendGeneralMessage('revoked');

        } else if (resourcePath === "/auth/associate-resources" && httpMethod === "GET") {

            const { principleId, resourcePathPrefix } = getQueryStringParameters(event);
            const resourcePath = `${APPS_RESOURCE_PATH}/${resourcePathPrefix}`;
            return sendResponse(await service.getAssociateResources(principleId, resourcePath, preparePaginationRequest(event)));

        } else if (resourcePath === "/auth/associate-users" && httpMethod === "GET") {

            const { resourceId } = getQueryStringParameters(event);
            const resourcePath = `${APPS_RESOURCE_PATH}/${resourceId}`;
            const associateUsers = await service.getAssociateUsers(resourcePath);
            const newUsers = [];
            for (const acu of associateUsers.data) {
                try {
                    const user = await userService.getById(acu.principleId);
                    user.role = acu.role;
                    newUsers.push(user);
                }catch (e) {
                    console.error("error load user data", acu.principleId)
                }
            }
            associateUsers.data = newUsers;
            return sendResponse(associateUsers);

        } else if (resourcePath === "/auth/me" && httpMethod === "POST") {
            const { appId, locationId } = getAppIdLocationIdFromEvent(event);
            const principleId = getUserIdFromEvent(event);
            const resource = `${APPS_RESOURCE_PATH}/${AUTH_LOCATION_RESOURCE_PATH}`;
            const resourcePath = `${resource}/${appId}/${locationId}`;
            const principle = await service.currentUser(principleId, resourcePath);
            if (principle) {
                return sendResponse(principle);
            } else {
                throw new UnauthorizedAccessError(`userId: ${principleId}, resource: ${resourcePath}`);
            }

        }else {
            throw new InvalidError(`invalid route ${resourcePath}:${httpMethod}`);
        }
    } catch (err) {
        console.error('handler execution failed', err);
        return sendError(err.message, err.code);
    }
}