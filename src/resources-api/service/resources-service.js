const {
    S3Client,
    PutObjectCommand
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { InvalidError, ValidationError } = require('common-lib/exception');
const { createUniqueId } = require('common-lib/utils/object-utils');
const { RESOURCES_BUCKET, FUNCTIONS_REGISTRY } = require('../config/app-config');
const { RESOURCE_TYPES, QUIZ_TYPE, QUIZ_QUESTIONS_TYPE } = require('../const/resource-types');
const {
    requiredFieldsCheck
} = require("common-lib/utils/object-utils");

class ResourcesService {
    constructor() {
        this.s3Client = new S3Client();
    }

    async getUploadUrl(request) {
        const {
            resourceType,
            field,
            fileExt = 'png',
        } = request;

        if (!RESOURCE_TYPES.includes(resourceType)) {
            throw new InvalidError(`invalid resource type ${resourceType}`);
        }

        const itemId = createUniqueId();
        const metadata = this.getMetadataBasedOnType(resourceType, {
            'resourcetype': resourceType,
            'itemid': itemId,
            'field': field
        }, request)

        const resourceId = metadata.resourceid;
        const bucketParams = {
            Bucket: RESOURCES_BUCKET,
            Key: `${resourceType}/${resourceId}-${field}-${itemId}.${fileExt}`,
            Metadata: metadata
        };
        const command = new PutObjectCommand(bucketParams);
        const signedUrl = await getSignedUrl(this.s3Client, command, {
            expiresIn: 3600, // seconds
        });
        return { url: signedUrl };
    }

    getMetadataBasedOnType(resourceType, metadata, request) {
        if (QUIZ_TYPE === resourceType) {
            this.validateMetadataRequest(request, ['quizId'])
            const { quizId } = request;
            metadata['quizid'] = quizId;
            metadata['resourceid'] = quizId;
        } else if (QUIZ_QUESTIONS_TYPE === resourceType) {
            this.validateMetadataRequest(request, ['quizId', 'questionId'])
            const { quizId, questionId } = request;
            metadata['quizid'] = quizId;
            metadata['questionid'] = questionId;
            metadata['resourceid'] = `${quizId}_${questionId}`;
        }
        return metadata
    }

    validateMetadataRequest(request, fields) {
        const check = requiredFieldsCheck(request, fields);
        if (!check.valid) {
            throw new ValidationError(check);
        }
    }

}

module.exports = ResourcesService;