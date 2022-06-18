import {LambdaConstructor} from "../../helpers/constructors/lambda-constructor";
import {ProjectConfig} from "../../config/project-config";
import LambdaLayers from "./lambda-layers";
import * as aws from "@pulumi/aws";
import {DYNAMO_DB_TABLE_ENV} from "../../consts/common-consts";
import {grantLambdaDynamoDBAccess} from "../../helpers/utils/iam-utils";
import {getResourceName} from "../../helpers/utils/common-utils";
import * as pulumi from "@pulumi/pulumi";
import ApiGateway from "../api-gateway";

export default class ResourcesApiStack {
    private readonly projectConfig: ProjectConfig;
    private readonly _apiFunc: LambdaConstructor;
    private readonly _resourceBucketId: string;
    private readonly _resourceBucket: aws.s3.Bucket;

    constructor(apiGateway: ApiGateway, lambdaLayers: LambdaLayers) {
        this.projectConfig = new ProjectConfig();

        this._resourceBucketId = getResourceName("resources");
        this._resourceBucket = this.createResourcesBucket();

        const envVariables: any = {};
        envVariables["RESOURCES_BUCKET"] = this._resourceBucketId;

        this._apiFunc = new LambdaConstructor('resources-api', {
            handlerPath: 'resources-api',
            envVariables: envVariables,
            layers: lambdaLayers.getDefaultLayers(),
        });
        this.grantLambdaS3Access(this._apiFunc.role, this._resourceBucketId);

        apiGateway.addEndpoint(this._apiFunc.lambdaFunc, `/resources/upload-url`, "POST");
    }

    private createResourcesBucket() {
        return new aws.s3.Bucket(this._resourceBucketId, {
            bucket: this._resourceBucketId,
            acl: "public-read",
            tags: {
                Name: this._resourceBucketId,
            },
            policy: `{
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Sid": "PublicRead",
                        "Effect": "Allow",
                        "Principal": "*",
                        "Action": [
                            "s3:GetObject",
                            "s3:GetObjectVersion"
                        ],
                        "Resource": [
                            "arn:aws:s3:::${this._resourceBucketId}/*"
                        ]
                    }
                ]
            }`,
            corsRules: [{
                allowedHeaders: ["*"],
                allowedMethods: [
                    "GET",
                    "HEAD",
                    "PUT",
                    "POST",
                    "DELETE"
                ],
                allowedOrigins: ["*"],
                exposeHeaders: [
                    "x-amz-server-side-encryption",
                    "x-amz-request-id",
                    "x-amz-id-2",
                    "ETag"],
                maxAgeSeconds: 3000,
            }]
        });
    }

    private grantLambdaS3Access(lambdaRole: aws.iam.Role, resourceBucketId: string) {
        const resourceId = getResourceName('res-access');
        const policy = new aws.iam.Policy(resourceId, {
            policy: pulumi.output({
                Version: "2012-10-17",
                Statement: [{
                    Action: [
                        "s3:PutObject",
                        "s3:GetObject",
                        "s3:GetObjectTagging",
                        "s3:GetObjectVersion"
                    ],
                    Resource: [`arn:aws:s3:::${resourceBucketId}/*`],
                    Effect: "Allow",
                }],
            }),
        });
        new aws.iam.RolePolicyAttachment(`${resourceId}-att`, {
            role: lambdaRole,
            policyArn: policy.arn,
        });
    }

    public get resourceBucket() {
        return this._resourceBucket;
    }
}