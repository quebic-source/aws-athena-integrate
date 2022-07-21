import {LambdaConstructor} from "../../helpers/constructors/lambda-constructor";
import ApiGateway from "../api-gateway";
import {ProjectConfig} from "../../config/project-config";
import LambdaLayers from "./lambda-layers";

export default class AthenaApiStack {
    private readonly projectConfig: ProjectConfig;
    private readonly apiGateway: ApiGateway;
    private readonly _apiFunc: LambdaConstructor;

    constructor(apiGateway: ApiGateway, lambdaLayers: LambdaLayers) {
        this.apiGateway = apiGateway;
        this.projectConfig = new ProjectConfig();

        const envVariables: any = {};
        envVariables['TEST'] = 'test';

        this._apiFunc = new LambdaConstructor('athena-api', {
            handlerPath: 'athena-api',
            envVariables: envVariables,
            layers: lambdaLayers.getDefaultLayers(),
        });
        this.apiGateway.addEndpoint(this._apiFunc.lambdaFunc, "/athena", "POST");
    }

    public get apiFunc() {
        return this._apiFunc;
    }
}