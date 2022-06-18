import Authorizer from "./resources/lambda/authorizer";
import ApiGateway from "./resources/api-gateway";
import Cognito from "./resources/cognito";
import Dynamodb from "./resources/dynamodb";
import LambdaLayers from "./resources/lambda/lambda-layers";
import AuthorizerApiStack from "./resources/lambda/authorizer-api-stack";
import AppsApiStack from "./resources/lambda/apps-api-stack";
import RoleApiStack from "./resources/lambda/role-api-stack";
import UsersApiStack from "./resources/lambda/users-api-stack";
import CognitoTriggersStack from "./resources/lambda/cognito-triggers-stack";
import LocationsApiStack from "./resources/lambda/locations-api-stack";
import ConfigApiStack from "./resources/lambda/config-api-stack";
import RoomTypesApiStack from "./resources/lambda/room-types-api-stack";
import PackagesApiStack from "./resources/lambda/packages-api-stack";
import TaxesApiStack from "./resources/lambda/taxes-api-stack";
import RatesApiStack from "./resources/lambda/rates-api-stack";
import ResourcesApiStack from "./resources/lambda/resources-api-stack";

const dynamodb = new Dynamodb();
const lambdaLayers = new LambdaLayers();

const cognitoTriggerStack = new CognitoTriggersStack(lambdaLayers, dynamodb.usersApiTable);
const cognito = new Cognito(cognitoTriggerStack);

const authorizerLambda = new Authorizer(cognito);
const apiGateway = new ApiGateway(authorizerLambda);

const roleApiFunc = new RoleApiStack(apiGateway, lambdaLayers, dynamodb.rolesApiTable).apiFunc.lambdaFunc;
new ConfigApiStack(apiGateway, lambdaLayers, dynamodb.configsApiTable)
new AuthorizerApiStack(apiGateway, lambdaLayers, dynamodb.authorizerApiTable, roleApiFunc);
new UsersApiStack(apiGateway, lambdaLayers, dynamodb.usersApiTable, cognito.userPool)
new AppsApiStack(apiGateway, lambdaLayers, dynamodb.appsApiTable);
new LocationsApiStack(apiGateway, lambdaLayers, dynamodb.locationsApiTable);
new RoomTypesApiStack(apiGateway, lambdaLayers, dynamodb.roomTypesApiTable);
new PackagesApiStack(apiGateway, lambdaLayers, dynamodb.packagesApiTable);
new TaxesApiStack(apiGateway, lambdaLayers, dynamodb.taxesApiTable);
new RatesApiStack(apiGateway, lambdaLayers, dynamodb.ratesApiTable);
new ResourcesApiStack(apiGateway, lambdaLayers);

apiGateway.deploy();
