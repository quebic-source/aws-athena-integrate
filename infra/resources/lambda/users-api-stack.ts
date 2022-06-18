import {LambdaConstructor} from "../../helpers/constructors/lambda-constructor";
import ApiGateway from "../api-gateway";
import {ProjectConfig} from "../../config/project-config";
import LambdaLayers from "./lambda-layers";
import * as aws from "@pulumi/aws";
import {AUTHORIZER_API_FUNC, CONSUMER_USER_POOL_ID, DYNAMO_DB_TABLE_ENV} from "../../consts/common-consts";
import {grantLambdaDynamoDBAccess} from "../../helpers/utils/iam-utils";
import {getAuthorizerFuncName} from "../../helpers/utils/auth-utils";
import {UserPool} from "@pulumi/aws/cognito";
import {getResourceName} from "../../helpers/utils/common-utils";
import * as pulumi from "@pulumi/pulumi";

export default class UsersApiStack {
    private readonly projectConfig: ProjectConfig;
    private readonly apiGateway: ApiGateway;

    constructor(apiGateway: ApiGateway, lambdaLayers: LambdaLayers, table: aws.dynamodb.Table, consumerUserPool: UserPool) {
        this.apiGateway = apiGateway;
        this.projectConfig = new ProjectConfig();

        const envVariables: any = {};
        envVariables[DYNAMO_DB_TABLE_ENV] = table.name;
        envVariables[AUTHORIZER_API_FUNC] = getAuthorizerFuncName();
        envVariables[CONSUMER_USER_POOL_ID] = consumerUserPool.id;

        const apiFunc = new LambdaConstructor('users-api', {
            handlerPath: 'users-api',
            envVariables: envVariables,
            layers: lambdaLayers.getDefaultLayers(),
        });
        grantLambdaDynamoDBAccess("users-api-db", apiFunc.role, table);
        this.grantCognitoAccess("users-api-cognito", apiFunc.role)
        this.apiGateway.addEndpoint(apiFunc.lambdaFunc, "/users", "GET");
        this.apiGateway.addEndpoint(apiFunc.lambdaFunc, "/users", "PUT");
        this.apiGateway.addEndpoint(apiFunc.lambdaFunc, "/users/{userId}", "GET");
        this.apiGateway.addEndpoint(apiFunc.lambdaFunc, "/users/search", "GET");
    }

    private grantCognitoAccess(id: string, lambdaRole: aws.iam.Role) {
        const resourceId = getResourceName(id);
        const policy = new aws.iam.Policy(resourceId, {
            policy: pulumi.output({
                Version: "2012-10-17",
                Statement: [{
                    Action: "cognito-idp:*",
                    Resource: "*", // TODO need to add table and table-indexes
                    Effect: "Allow",
                }],
            }),
        });
        new aws.iam.RolePolicyAttachment(`${resourceId}-att`, {
            role: lambdaRole,
            policyArn: policy.arn,
        });
    }
}