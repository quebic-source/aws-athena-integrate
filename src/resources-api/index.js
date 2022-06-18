const {
    sendError,
    sendResponse,
    getRequestBody
} = require("common-lib/utils/http-utils");
const {
    requiredFieldsCheck
} = require("common-lib/utils/object-utils");
const { InvalidError, ValidationError } = require('common-lib/exception');
const ResourcesService = require("./service/resources-service");

const service = new ResourcesService();

const RESOURCE_PATH = '/resources';

exports.handler = async function (event, context) {
    console.log("event", JSON.stringify(event));
    try {
        const resourcePath = event.resource;
        const httpMethod = event.httpMethod;

        if (resourcePath === `${RESOURCE_PATH}/upload-url` && httpMethod === "POST") {

            const request = getRequestBody(event);
            const check = requiredFieldsCheck(request, [
                'resourceType'
            ]);
            if (!check.valid) {
                throw new ValidationError(check);
            }
            return sendResponse(await service.getUploadUrl(request));

        } else {
            throw new InvalidError(`invalid route ${resourcePath}:${httpMethod}`);
        }
    } catch (err) {
        console.error('handler execution failed', err);
        return sendError(err.message, err.code);
    }
}