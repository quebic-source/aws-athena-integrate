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
    preparePaginationRequest
} = require("common-lib/utils/pagination-utils");
const { InvalidError } = require('common-lib/exception');
const UserService = require("./service/user-service");
const CognitoService = require("./service/cognito-service");

const userService = new UserService();
const cognitoService = new CognitoService();

const ID_PATH_PARAM = "{userId}";
const RESOURCE_PATH = `/users`;

exports.handler = async function (event, context) {
    console.log("event", JSON.stringify(event));
    try {
        const resourcePath = event.resource;
        const httpMethod = event.httpMethod;

        if (resourcePath === `${RESOURCE_PATH}/search` && httpMethod === "GET") {
            const { email } = getQueryStringParameters(event);
            return sendResponse(await userService.getAllByEmail(
                email,
                preparePaginationRequest(event)));

        } else if (resourcePath === `${RESOURCE_PATH}/${ID_PATH_PARAM}` && httpMethod === "GET") {
            // userInfo
            const {userId} = getPathParams(event);
            return sendResponse(await userService.getById(userId));

        } else if (resourcePath === RESOURCE_PATH && httpMethod === "PUT") {
            const userId = getUserIdFromEvent(event);
            const request = getRequestBody(event);
            request.id = userId;
            await cognitoService.updateUser(request)
            await userService.update(request);
            return sendGeneralMessage('updated', 200);

        } else {
            throw new InvalidError(`invalid route ${resourcePath}:${httpMethod}`);
        }
    } catch (err) {
        console.error('handler execution failed', err);
        return sendError(err.message, err.code);
    }
}