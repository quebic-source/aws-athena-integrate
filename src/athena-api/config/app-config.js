const DB_CONFIG = {
    DYNAMO_DB_TABLE: process.env.DYNAMO_DB_TABLE
}

const FUNCTIONS_REGISTRY = {
    AUTHORIZER_API_FUNC: process.env.AUTHORIZER_API_FUNC
}

const ENV = {
    DEPLOY_ENV: process.env.DEPLOY_ENV,
    DEPLOY_ENV_PREFIX: process.env.DEPLOY_ENV_PREFIX,
}

module.exports = {
    DB_CONFIG,
    FUNCTIONS_REGISTRY,
    ENV
}