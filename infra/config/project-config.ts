import * as pulumi from "@pulumi/pulumi";

export interface ApigatewayConfigType {
    accessControlAllowHeaders: string;
    accessControlAllowMethods: string;
    accessControlAllowOrigin: string;
}

export interface ApigatewayRouteConfigType {
    domain: string;
    domainCertArn: string;
    hostedZoneId: string;
    authorizerArn: string;
}

export interface AuthConfigType {
    authorizerFunc: string;
    authorizedResources: string;
}

export class ProjectConfig {
    private readonly _env: string;
    private readonly _projectName: string;
    private readonly _apigatewayConfig: ApigatewayConfigType;
    private readonly _apigatewayRouteConfig: ApigatewayRouteConfigType;
    private readonly _authConfigType: AuthConfigType;

    constructor() {
        const config = new pulumi.Config("project");
        this._env = pulumi.getStack();
        this._projectName =  pulumi.getProject();
        this._apigatewayConfig = config.requireObject<ApigatewayConfigType>("apigateway");
        this._apigatewayRouteConfig = config.requireObject<ApigatewayRouteConfigType>("apigatewayRoute");
        this._authConfigType = config.requireObject<AuthConfigType>("auth");
    }

    public get env(): string {
        return this._env;
    }

    public get projectName(): string {
        return this._projectName;
    }

    public get apigateway(): ApigatewayConfigType {
        return this._apigatewayConfig;
    }

    public get apigatewayRouteConfig(): ApigatewayRouteConfigType {
        return this._apigatewayRouteConfig;
    }

    public get authConfig(): AuthConfigType {
        return this._authConfigType;
    }
}
