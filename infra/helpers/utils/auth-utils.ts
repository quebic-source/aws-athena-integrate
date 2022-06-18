import {ProjectConfig} from "../../config/project-config";
import {getResourceName} from "./common-utils";

export function getAuthorizerFuncName() {
    const projectConfig = new ProjectConfig();
    return getResourceName(projectConfig.authConfig.authorizerFunc);
}