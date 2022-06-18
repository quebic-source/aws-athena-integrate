import * as aws from "@pulumi/aws";
import { LambdaConstructor } from "../../helpers/constructors/lambda-constructor";
import Cognito from "../cognito";
import {ProjectConfig} from "../../config/project-config";
import {AUTHORIZER_API_FUNC} from "../../consts/common-consts";
import {getAuthorizerFuncName} from "../../helpers/utils/auth-utils";

export default class Authorizer {
    private readonly _authorizerLambda: aws.lambda.Function;

    constructor(cognito: Cognito) {
        const projectConfig = new ProjectConfig();

        const envVariables: any = {};
        envVariables["COGNITO_POOL_ID"] = cognito.userPool.id;
        envVariables["AUTHORIZED_RESOURCES"] = projectConfig.authConfig.authorizedResources;
        envVariables[AUTHORIZER_API_FUNC] = getAuthorizerFuncName();

        this._authorizerLambda = new LambdaConstructor("authorizer", {
            handlerPath: "authorizer",
            envVariables
        }).lambdaFunc;
    }

    public get authorizerLambda() {
        return this._authorizerLambda;
    }
}