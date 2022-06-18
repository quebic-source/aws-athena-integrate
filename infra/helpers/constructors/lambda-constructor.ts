import * as aws from "@pulumi/aws";
import {LAMBDA_DEFAULT_RUNTIME, LAMBDA_HANDLER, LAMBDA_HANDLERS_LOCATION, LAMBDA_DEFAULT_MEMORY_SIZE, LAMBDA_DEFAULT_TIMEOUT} from "../../consts/common-consts";
import {getResourceName} from "../utils/common-utils";
import {LambdaCreateArgs} from "../../types/aws-resources";
import * as pulumi from "@pulumi/pulumi";
import {ProjectConfig} from "../../config/project-config";
import {IAMRoleConstructor, RolePolicyAttachmentConstructor} from "./iam-constructor";

export class LambdaConstructor {
    private readonly _projectConfig: ProjectConfig;
    private readonly _resourceName: string;
    private readonly _lambdaFunc: aws.lambda.Function;
    private readonly _role: aws.iam.Role;

    constructor(name: string,
                args: LambdaCreateArgs) {
        this._projectConfig = new ProjectConfig();
        this._role = new IAMRoleConstructor(name, LambdaConstructor.getLambdaAssumeRolePolicy()).role;
        new RolePolicyAttachmentConstructor(name, this._role, aws.iam.ManagedPolicies.AWSLambdaExecute);

        this._resourceName = getResourceName(name);
        this._lambdaFunc = new aws.lambda.Function(this._resourceName, {
            code: new pulumi.asset.FileArchive(`${LAMBDA_HANDLERS_LOCATION}/${args.handlerPath}`),
            name: this._resourceName,
            handler: args.handler || LAMBDA_HANDLER,
            runtime: args.runtime || LAMBDA_DEFAULT_RUNTIME,
            environment: { variables: args.envVariables },
            memorySize: args.memorySize || LAMBDA_DEFAULT_MEMORY_SIZE ,
            timeout: args.timeout || LAMBDA_DEFAULT_TIMEOUT,
            description: args.description,
            layers: args.layers?.map(l => l.arn),
            tags: {
              env: args.env || `${this._projectConfig.env}`,
              api: args.api || `${this._projectConfig.projectName}`
            },
            role: this._role.arn,
        });

        this.addDefaultPolices();
    }

    public get lambdaFunc() {
        return this._lambdaFunc;
    }

    public get resourceName() {
      return this._resourceName;
    }

    public get role() {
        return this._role;
    }

    private static getLambdaAssumeRolePolicy(): string {
        return `{
          "Version": "2012-10-17",
          "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Principal": {
                "Service": "lambda.amazonaws.com"
              },
              "Effect": "Allow",
              "Sid": ""
            }
          ]
        }
        `
    }

    private addDefaultPolices() {
        const policy = new aws.iam.Policy(`${this._resourceName}-default`, {
            policy: pulumi.output({
                Version: "2012-10-17",
                Statement: [{
                    Action: [
                        "lambda:InvokeFunction",
                        "lambda:GetFunction",
                        "lambda:InvokeAsync"
                    ],
                    Resource: "*",
                    Condition: {
                        "StringNotEquals": {
                            "aws:PrincipalTag/api": this._projectConfig.projectName
                        }
                    },
                    Effect: "Allow",
                }],
            }),
        });
        new aws.iam.RolePolicyAttachment(`${this._resourceName}-default`, {
            role: this._role,
            policyArn: policy.arn,
        });
    }
}