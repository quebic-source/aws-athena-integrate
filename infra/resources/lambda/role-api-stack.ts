import {LambdaConstructor} from "../../helpers/constructors/lambda-constructor";
import ApiGateway from "../api-gateway";
import {ProjectConfig} from "../../config/project-config";
import LambdaLayers from "./lambda-layers";
import * as aws from "@pulumi/aws";
import {DYNAMO_DB_TABLE_ENV} from "../../consts/common-consts";
import {grantLambdaDynamoDBAccess} from "../../helpers/utils/iam-utils";

export default class RoleApiStack {
    private readonly projectConfig: ProjectConfig;
    private readonly apiGateway: ApiGateway;
    private readonly _apiFunc: LambdaConstructor;

    constructor(apiGateway: ApiGateway, lambdaLayers: LambdaLayers, table: aws.dynamodb.Table) {
        this.apiGateway = apiGateway;
        this.projectConfig = new ProjectConfig();

        const envVariables: any = {};
        envVariables[DYNAMO_DB_TABLE_ENV] = table.name;

        this._apiFunc = new LambdaConstructor('roles-api', {
            handlerPath: 'roles-api',
            envVariables: envVariables,
            layers: lambdaLayers.getDefaultLayers(),
        });
        grantLambdaDynamoDBAccess("roles-api-db", this._apiFunc.role, table);
        this.apiGateway.addEndpoint(this._apiFunc.lambdaFunc, "/roles", "GET");
        this.apiGateway.addEndpoint(this._apiFunc.lambdaFunc, "/roles/{roleId}", "GET");
        this.apiGateway.addEndpoint(this._apiFunc.lambdaFunc, "/roles", "POST");
        this.apiGateway.addEndpoint(this._apiFunc.lambdaFunc, "/roles/{roleId}", "PUT");
        this.apiGateway.addEndpoint(this._apiFunc.lambdaFunc, "/roles/{roleId}", "DELETE");
    }

    public get apiFunc() {
        return this._apiFunc;
    }
}