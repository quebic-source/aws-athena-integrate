import {LambdaConstructor} from "../../helpers/constructors/lambda-constructor";
import ApiGateway from "../api-gateway";
import {ProjectConfig} from "../../config/project-config";
import LambdaLayers from "./lambda-layers";
import * as aws from "@pulumi/aws";
import {DYNAMO_DB_TABLE_ENV} from "../../consts/common-consts";
import {grantLambdaDynamoDBAccess} from "../../helpers/utils/iam-utils";

export default class ConfigApiStack {
    private readonly projectConfig: ProjectConfig;
    private readonly apiGateway: ApiGateway;
    private readonly _apiFunc: LambdaConstructor;

    constructor(apiGateway: ApiGateway, lambdaLayers: LambdaLayers, table: aws.dynamodb.Table) {
        this.apiGateway = apiGateway;
        this.projectConfig = new ProjectConfig();

        const envVariables: any = {};
        envVariables[DYNAMO_DB_TABLE_ENV] = table.name;

        this._apiFunc = new LambdaConstructor('config-api', {
            handlerPath: 'configs-api',
            envVariables: envVariables,
            layers: lambdaLayers.getDefaultLayers(),
        });
        grantLambdaDynamoDBAccess("config-api-db", this._apiFunc.role, table);
        this.apiGateway.addEndpoint(this._apiFunc.lambdaFunc, "/configs", "GET",
            { authorizerNone: true });
        this.apiGateway.addEndpoint(this._apiFunc.lambdaFunc, "/configs/{configId}", "GET",
            { authorizerNone: true });
        this.apiGateway.addEndpoint(this._apiFunc.lambdaFunc, "/configs", "POST");
        this.apiGateway.addEndpoint(this._apiFunc.lambdaFunc, "/configs/{configId}", "PUT");
        this.apiGateway.addEndpoint(this._apiFunc.lambdaFunc, "/configs/{configId}", "DELETE");
    }

    public get apiFunc() {
        return this._apiFunc;
    }
}