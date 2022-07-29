import {LambdaConstructor} from "../../helpers/constructors/lambda-constructor";
import ApiGateway from "../api-gateway";
import {ProjectConfig} from "../../config/project-config";
import LambdaLayers from "./lambda-layers";
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import {getResourceName} from "../../helpers/utils/common-utils";

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
        this.grantAccess("athena-api-athena-per", this._apiFunc.role);
    }

    private grantAccess(id: string, lambdaRole: aws.iam.Role) {
        const resourceId = getResourceName(id);
        const policy = new aws.iam.Policy(resourceId, {
            policy: pulumi.output({
                Version: "2012-10-17",
                Statement: [{
                    Action: [
                        "athena:*"
                    ],
                    Resource: "*",
                    Effect: "Allow",
                },
                    {
                        Action: [
                            "s3:*"
                        ],
                        Resource: "*",
                        Effect: "Allow",
                    }
                ],
            }),
        });
        new aws.iam.RolePolicyAttachment(`${resourceId}-att`, {
            role: lambdaRole,
            policyArn: policy.arn,
        });
    }

    public get apiFunc() {
        return this._apiFunc;
    }
}
