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

const RESOURCE_PATH = '/athena';

exports.handler = async function (event, context) {
    console.log("event", JSON.stringify(event));
    try {
        const resourcePath = event.resource;
        const httpMethod = event.httpMethod;

        if (resourcePath === RESOURCE_PATH && httpMethod === "GET") {

            return sendResponse({message: '1'});

        } else {
            throw new InvalidError(`invalid route ${resourcePath}:${httpMethod}`);
        }
    } catch (err) {
        console.error('handler execution failed', err);
        return sendError(err.message, err.code);
    }
}