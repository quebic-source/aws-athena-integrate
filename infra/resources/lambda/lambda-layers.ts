import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import {ProjectConfig} from "../../config/project-config";
import {getResourceName} from "../../helpers/utils/common-utils";
import {LAMBDA_DEFAULT_RUNTIME, LAMBDA_HANDLERS_LOCATION} from "../../consts/common-consts";

export default class LambdaLayers {
    private readonly projectConfig: ProjectConfig;
    private readonly _commonLibLayer: aws.lambda.LayerVersion;
    private readonly _3rdPartyLibLayer: aws.lambda.LayerVersion;

    constructor() {
        this.projectConfig = new ProjectConfig();
        this._commonLibLayer = this.createLayer("common-lib", "common/common-lib/");
        this._3rdPartyLibLayer = this.createLayer("common-3rd-party", "common/3rd-party/");
    }

    private createLayer(name: string, modulePath: string) {
        const resourceId = getResourceName(name);
        return new aws.lambda.LayerVersion(resourceId, {
            compatibleRuntimes: [LAMBDA_DEFAULT_RUNTIME],
            code: new pulumi.asset.FileArchive(`${LAMBDA_HANDLERS_LOCATION}/layers/${modulePath}`),
            layerName: resourceId,
        });
    }

    public getDefaultLayers(): aws.lambda.LayerVersion[] {
        return [
            this._commonLibLayer,
            this._3rdPartyLibLayer
        ]
    }
}