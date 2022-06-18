import {LambdaConstructor} from "../../helpers/constructors/lambda-constructor";
import ApiGateway from "../api-gateway";
import {ProjectConfig} from "../../config/project-config";
import LambdaLayers from "./lambda-layers";
import * as aws from "@pulumi/aws";
import {DYNAMO_DB_TABLE_ENV, ROLES_API_FUNC, USERS_API_FUNC} from "../../consts/common-consts";
import {grantLambdaDynamoDBAccess} from "../../helpers/utils/iam-utils";
import {getResourceName} from "../../helpers/utils/common-utils";

export default class AuthorizerApiStack {
    private readonly projectConfig: ProjectConfig;
    private readonly apiGateway: ApiGateway;

    constructor(apiGateway: ApiGateway, lambdaLayers: LambdaLayers, table: aws.dynamodb.Table, roleApiFunc: aws.lambda.Function) {
        this.apiGateway = apiGateway;
        this.projectConfig = new ProjectConfig();
        const envVariables: any = {};
        envVariables[DYNAMO_DB_TABLE_ENV] = table.name;
        envVariables[ROLES_API_FUNC] = roleApiFunc.name;
        envVariables[USERS_API_FUNC] = getResourceName("users-api")
        const resourceId = this.projectConfig.authConfig.authorizerFunc;
        const projectsApiFunc = new LambdaConstructor(resourceId, {
            handlerPath: 'authorizer-api',
            envVariables: envVariables,
            layers: lambdaLayers.getDefaultLayers()
        });
        grantLambdaDynamoDBAccess("authorizer-api-db", projectsApiFunc.role, table);
        this.apiGateway.addEndpoint(projectsApiFunc.lambdaFunc, "/auth/is-authorized", "POST");
        this.apiGateway.addEndpoint(projectsApiFunc.lambdaFunc, "/auth/assign", "POST");
        this.apiGateway.addEndpoint(projectsApiFunc.lambdaFunc, "/auth/revoke", "POST");
        this.apiGateway.addEndpoint(projectsApiFunc.lambdaFunc, "/auth/me", "POST");
        this.apiGateway.addEndpoint(projectsApiFunc.lambdaFunc, "/auth/associate-resources", "GET");
        this.apiGateway.addEndpoint(projectsApiFunc.lambdaFunc, "/auth/associate-users", "GET");
    }
}