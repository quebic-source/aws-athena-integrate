import * as pulumi from "@pulumi/pulumi";
import {ProjectConfig} from "../config/project-config";
import * as aws from "@pulumi/aws";
import {getResourceName} from "../helpers/utils/common-utils";
import CognitoTriggersStack from "./lambda/cognito-triggers-stack";

export default class Cognito {
    private readonly projectConfig: ProjectConfig;
    private readonly _userPool: aws.cognito.UserPool;
    private readonly _userPoolClient: aws.cognito.UserPoolClient;

    constructor(cognitoTriggersStack: CognitoTriggersStack) {
        this.projectConfig = new ProjectConfig();
        this._userPool = this.createUserPool(cognitoTriggersStack);
        this._userPoolClient = this.createUserPoolClient();
        this.createUserPoolDomain();
    }

    private createUserPool(cognitoTriggersStack: CognitoTriggersStack) {
        const poolName = getResourceName("user-pool");
        const usernameAttributes = ["email"];
        const autoVerifiedAttributes = ["email"];
        const accountRecoverySetting = {
            recoveryMechanisms: [
                {
                    name: "verified_email",
                    priority: 1,
                },
                {
                    name: "verified_phone_number",
                    priority: 2,
                },
            ],
        }

        const userPool = new aws.cognito.UserPool(
            getResourceName(poolName), {
                name: poolName,
                usernameAttributes,
                accountRecoverySetting,
                autoVerifiedAttributes,
                schemas: [
                    {
                        name: 'name',
                        attributeDataType: 'String',
                        required: true,
                        stringAttributeConstraints: {
                            minLength: "1",
                            maxLength: "256",
                        }
                    },
                    {
                        name: 'phone_number',
                        attributeDataType: 'String',
                        required: false,
                        stringAttributeConstraints: {
                            minLength: "1",
                            maxLength: "256",
                        }
                    }
                ],
                verificationMessageTemplate: {
                    defaultEmailOption: 'CONFIRM_WITH_LINK',
                    emailSubject: 'Your verification link',
                    emailMessageByLink: 'Please click the link below to verify your email address. {##Verify Email##} '
                },
                lambdaConfig: {
                    postConfirmation: cognitoTriggersStack.postConfirmCognitoTrigger.lambdaFunc.arn
                }
            }
        );

        CognitoTriggersStack.grantTrigger(
            'post-confirm',
            userPool,
            cognitoTriggersStack.postConfirmCognitoTrigger.lambdaFunc
        );

        return userPool;
    }

    private createUserPoolDomain() {
        const domainName = `athena-auth-${pulumi.getStack()}`;
        return new aws.cognito.UserPoolDomain(domainName, {
            domain: domainName,
            userPoolId: this._userPool.id,
        });
    }

    private createUserPoolClient() {
        const clientName = getResourceName("client");
        return new aws.cognito.UserPoolClient(clientName, {
            name: clientName,
            userPoolId: this._userPool.id,
            generateSecret: false,
            explicitAuthFlows: ["ALLOW_USER_SRP_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"],
            allowedOauthFlows: ["code", "implicit"],
            allowedOauthScopes: ["phone", "email", "openid", "profile", "aws.cognito.signin.user.admin"],
            allowedOauthFlowsUserPoolClient: true,
            supportedIdentityProviders: ["COGNITO"],
            callbackUrls: ['https://example.org']
        });
    }

    public get userPool() {
        return this._userPool;
    }

    public get userPoolClient() {
        return this._userPoolClient;
    }
}