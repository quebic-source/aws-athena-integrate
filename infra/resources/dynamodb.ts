import {ProjectConfig} from "../config/project-config";
import * as aws from "@pulumi/aws";
import {getResourceName} from "../helpers/utils/common-utils";
import * as pulumi from "@pulumi/pulumi";
import {input as inputs} from "@pulumi/aws/types";

const PK_FIELD = 'pk';
const SK_FIELD = 'sk';

export default class Dynamodb {
    private readonly _projectConfig: ProjectConfig;
    private readonly _rolesApiTable: aws.dynamodb.Table;
    private readonly _configsApiTable: aws.dynamodb.Table;
    private readonly _usersApiTable: aws.dynamodb.Table;
    private readonly _appsApiTable: aws.dynamodb.Table;
    private readonly _locationsApiTable: aws.dynamodb.Table;
    private readonly _authorizerApiTable: aws.dynamodb.Table;
    private readonly _roomTypesApiTable: aws.dynamodb.Table;
    private readonly _packagesApiTable: aws.dynamodb.Table;
    private readonly _taxesApiTable: aws.dynamodb.Table;
    private readonly _ratesApiTable: aws.dynamodb.Table;

    constructor() {
        this._projectConfig = new ProjectConfig();
        this._rolesApiTable = this._createTable("roles-api");
        this._configsApiTable = this._createTable("configs-api");
        this._usersApiTable = this._createTable("users-api", [
            {
                hashKey: 'email',
                rangeKey: PK_FIELD,
                name: "email-userid-index",
                projectionType: "ALL"
            }
            ], [{
                name: 'email',
                type: "S",
        }]);
        this._appsApiTable = this._createTable("apps-api");
        this._locationsApiTable = this._createTable("locations-api-db");
        this._authorizerApiTable = this._createTable("authorizer-api", [
            {
                hashKey: SK_FIELD,
                rangeKey: PK_FIELD,
                name: "resource-principle-index",
                projectionType: "ALL"
            }
        ]);

        this._roomTypesApiTable = this._createTable("room-types-api-db");
        this._packagesApiTable = this._createTable("packages-api-db");
        this._taxesApiTable = this._createTable("taxes-api-db");
        this._ratesApiTable = this._createTable("rates-api-db");
    }

    private _createTable(
        tableName: string,
        globalSecondaryIndexes?: pulumi.Input<pulumi.Input<inputs.dynamodb.TableGlobalSecondaryIndex>[]>,
        defineAttributes?: any[]) {
        const name = getResourceName(tableName);
        const attributes: any[] = [{
            name: PK_FIELD,
            type: "S",
        },
            {
                name: SK_FIELD,
                type: "S",
            }
        ];

        if (defineAttributes) {
            attributes.push(...defineAttributes);
        }

        return new aws.dynamodb.Table(name, {
            name,
            billingMode: "PAY_PER_REQUEST",
            hashKey: PK_FIELD,
            rangeKey: SK_FIELD,
            globalSecondaryIndexes,
            attributes,
            // replicas: [
            //     {
            //         regionName: "us-east-2",
            //     },
            //     {
            //         regionName: "us-west-2",
            //     },
            // ],
            //streamEnabled: true,
            //streamViewType: "NEW_AND_OLD_IMAGES",
        });
    }

    public get rolesApiTable() {
        return this._rolesApiTable;
    }

    public get configsApiTable() {
        return this._configsApiTable;
    }

    public get usersApiTable() {
        return this._usersApiTable;
    }

    public get appsApiTable() {
        return this._appsApiTable;
    }

    public get locationsApiTable() {
        return this._locationsApiTable;
    }

    public get authorizerApiTable() {
        return this._authorizerApiTable;
    }

    public get roomTypesApiTable() {
        return this._roomTypesApiTable;
    }

    public get packagesApiTable() {
        return this._packagesApiTable;
    }

    public get taxesApiTable() {
        return this._taxesApiTable;
    }

    public get ratesApiTable() {
        return this._ratesApiTable;
    }
}