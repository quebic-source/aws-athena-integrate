const FUNCTIONS_REGISTRY = {
    AUTHORIZER_API_FUNC: process.env.AUTHORIZER_API_FUNC
}

const AUTH = {
    COGNITO_POOL_ID: process.env.COGNITO_POOL_ID,
    AUTHORIZED_RESOURCES: process.env.AUTHORIZED_RESOURCES
}

const ENV = {
    DEPLOY_ENV: process.env.DEPLOY_ENV,
    DEPLOY_ENV_PREFIX: process.env.DEPLOY_ENV_PREFIX,
    AWS_REGION: process.env.AWS_REGION
}

module.exports = {
    FUNCTIONS_REGISTRY,
    AUTH,
    ENV
}