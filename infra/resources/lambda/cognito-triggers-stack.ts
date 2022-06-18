import {LambdaConstructor} from "../../helpers/constructors/lambda-constructor";
import ApiGateway from "../api-gateway";
import {ProjectConfig} from "../../config/project-config";
import LambdaLayers from "./lambda-layers";
import * as aws from "@pulumi/aws";
import {AUTHORIZER_API_FUNC, DYNAMO_DB_TABLE_ENV} from "../../consts/common-consts";
import {grantLambdaDynamoDBAccess} from "../../helpers/utils/iam-utils";
import {getAuthorizerFuncName} from "../../helpers/utils/auth-utils";
import {getResourceName} from "../../helpers/utils/common-utils";

export default class CognitoTriggersStack {
    private readonly projectConfig: ProjectConfig;
    private readonly _postConfirmCognitoTrigger: LambdaConstructor;

    constructor(lambdaLayers: LambdaLayers, table: aws.dynamodb.Table) {
        this.projectConfig = new ProjectConfig();

        const envVariables: any = {};
        envVariables[DYNAMO_DB_TABLE_ENV] = table.name;
        envVariables[AUTHORIZER_API_FUNC] = getAuthorizerFuncName();

        this._postConfirmCognitoTrigger = new LambdaConstructor('cog-tri-post-confirm', {
            handlerPath: 'users-api',
            handler: 'index-post-confirm-cognito-trigger.handler',
            envVariables: envVariables,
            layers: lambdaLayers.getDefaultLayers(),
        });
        grantLambdaDynamoDBAccess("cog-tri-post-confirm-db", this._postConfirmCognitoTrigger.role, table);
    }

    public get postConfirmCognitoTrigger() {
        return this._postConfirmCognitoTrigger;
    }

    public static grantTrigger(triggerId: string, userPool: aws.cognito.UserPool, lambda: aws.lambda.Function) {
        new aws.lambda.Permission(getResourceName(triggerId), {
            action: "lambda:InvokeFunction",
            function: lambda.name,
            principal: "cognito-idp.amazonaws.com",
            sourceArn: userPool.arn,
        });
    }
}