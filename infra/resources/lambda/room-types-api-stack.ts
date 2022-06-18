import {LambdaConstructor} from "../../helpers/constructors/lambda-constructor";
import ApiGateway from "../api-gateway";
import {ProjectConfig} from "../../config/project-config";
import LambdaLayers from "./lambda-layers";
import * as aws from "@pulumi/aws";
import {DYNAMO_DB_TABLE_ENV, AUTHORIZER_API_FUNC} from "../../consts/common-consts";
import {grantLambdaDynamoDBAccess} from "../../helpers/utils/iam-utils";
import {getAuthorizerFuncName} from "../../helpers/utils/auth-utils";
import {S3EventSourceMappingConstructor} from "../../helpers/constructors/event-source-mapping-construct";

export default class RoomTypesApiStack {
    private readonly projectConfig: ProjectConfig;
    private readonly apiGateway: ApiGateway;

    constructor(apiGateway: ApiGateway, lambdaLayers: LambdaLayers, table: aws.dynamodb.Table, resourceBucketArn: aws.s3.Bucket,) {
        this.apiGateway = apiGateway;
        this.projectConfig = new ProjectConfig();

        const envVariables: any = {};
        envVariables[DYNAMO_DB_TABLE_ENV] = table.name;
        envVariables[AUTHORIZER_API_FUNC] = getAuthorizerFuncName();

        const appsApiFunc = new LambdaConstructor('room-types-api', {
            handlerPath: 'room-types-api',
            envVariables: envVariables,
            layers: lambdaLayers.getDefaultLayers(),
        });
        grantLambdaDynamoDBAccess("room-types-api-db", appsApiFunc.role, table);
        this.apiGateway.addEndpoint(appsApiFunc.lambdaFunc, "/room-types", "GET");
        this.apiGateway.addEndpoint(appsApiFunc.lambdaFunc, "/room-types/{roomTypeId}", "GET");
        this.apiGateway.addEndpoint(appsApiFunc.lambdaFunc, "/room-types", "POST");
        this.apiGateway.addEndpoint(appsApiFunc.lambdaFunc, "/room-types/{roomTypeId}", "PUT");
        this.apiGateway.addEndpoint(appsApiFunc.lambdaFunc, "/room-types/{roomTypeId}", "DELETE");

        const resourceUploadTrigger = new LambdaConstructor('room-types-res-upload-trigger', {
            handlerPath: 'room-types-api',
            handler: 'resource-upload-trigger.handler',
            envVariables: envVariables,
            layers: lambdaLayers.getDefaultLayers(),
        });
        grantLambdaDynamoDBAccess("room-types-api-db-res-trigger", resourceUploadTrigger.role, table);
        new S3EventSourceMappingConstructor(
            "room-type-res-trigger",
            resourceBucketArn,
            resourceUploadTrigger.lambdaFunc,
            'roomType/')
    }
}