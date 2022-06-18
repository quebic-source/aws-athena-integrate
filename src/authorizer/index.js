const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const axios = require('axios');
const AuthorizerService = require("./service/authorizer-service");
const {ENV, AUTH} = require("./config/app-config");

// https://github.com/awslabs/aws-support-tools/blob/1fa6b704ac6b6066122cf711215519d9f5cf2589/Cognito/decode-verify-jwt/decode-verify-jwt.ts#L58
const cognitoIssuer = `https://cognito-idp.${ENV.AWS_REGION}.amazonaws.com/${AUTH.COGNITO_POOL_ID}`;
const authorizerService = new AuthorizerService();
const getPublicKeys = async () => {
    const keysEndpoint = `${cognitoIssuer}/.well-known/jwks.json`;
    const publicKeys = await axios.get(keysEndpoint);
    return publicKeys.data.keys.reduce((agg, current) => {
        const pem = jwkToPem(current);
        agg[current.kid] = {instance: current, pem};
        return agg;
    }, {});
}

const isAuthorizedToAccess = async (username, event) => {
    const pathParameters = event.pathParameters || {};
    const headers = event.headers || {};
    const appId = pathParameters.appId || headers['appid'];
    const locationId = pathParameters.locationId || headers['locationid'];
    if (appId && locationId) {
        await authorizerService.isAuthorized(username, `location/${appId}/${locationId}`);
    } else if (appId) {
        await authorizerService.isAuthorized(username, `app/${appId}`);
    }
}

exports.handler = async function (event, context, callback) {
    console.time("auth-process");
    console.log("event", JSON.stringify(event));
    try {
        console.time("token-validation");
        const token = event.headers['Authorization'];
        const tokenSections = (token || '').split('.');
        if (tokenSections.length < 2) {
            throw new Error('requested token is invalid');
        }
        const headerJSON = Buffer.from(tokenSections[0], 'base64').toString('utf8');
        const header = JSON.parse(headerJSON);

        const publicKeys = await getPublicKeys();
        const key = publicKeys[header.kid];
        if (key === undefined) {
            throw new Error('claim made for unknown kid');
        }

        const claim = jwt.verify(token, key.pem);

        const currentSeconds = Math.floor((new Date()).valueOf() / 1000);
        if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
            throw new Error('claim is expired or invalid');
        }
        if (claim.iss !== cognitoIssuer) {
            throw new Error('claim issuer is invalid');
        }
        if (claim.token_use !== 'access') {
            throw new Error('claim use is not access');
        }
        console.log(`claim confirmed for ${claim.username}`);
        console.timeEnd("token-validation");

        const username = claim.username;
        await isAuthorizedToAccess(username, event);

        callback(null, generatePolicy(username, 'Allow', event.methodArn, { username }));
    } catch (err) {
        console.error("token validation failed", err);
        callback(null, generatePolicy(null, 'Deny', event.methodArn, {}));
    }
    console.timeEnd("auth-process");
};

const generatePolicy = function (principalId, effect, resource, claims) {
    const authResponse = {};

    authResponse.principalId = principalId;
    if (effect && resource) {
        const policyDocument = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        const statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }

    authResponse.context = claims;
    return authResponse;
}