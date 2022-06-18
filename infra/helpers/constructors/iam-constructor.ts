import * as aws from "@pulumi/aws";
import {getResourceName} from "../utils/common-utils";
import * as pulumi from "@pulumi/pulumi";

export class IAMRoleConstructor {
    private readonly _role: aws.iam.Role;

    constructor(name: string, assumeRolePolicy: string) {
        this._role = new aws.iam.Role(getResourceName(name), {
            assumeRolePolicy
        })
    }

    public get role() {
        return this._role;
    }

}

export class RolePolicyConstructor {
    constructor(name: string, role: aws.iam.Role, policy: pulumi.Input<string>) {
        new aws.iam.RolePolicy(getResourceName(name), {
            role: role.id,
            policy,
        });
    }
}

export class RolePolicyAttachmentConstructor {
    constructor(name: string, role: aws.iam.Role, policyArn: string) {
        new aws.iam.RolePolicyAttachment(getResourceName(name), {
            role,
            policyArn,
        });
    }
}

