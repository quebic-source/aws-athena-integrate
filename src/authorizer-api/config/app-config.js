const DB_CONFIG = {
    DYNAMO_DB_TABLE: process.env.DYNAMO_DB_TABLE
}

const FUNCTIONS_REGISTRY = {
    ROLES_API_FUNC: process.env.ROLES_API_FUNC,
    USERS_API_FUNC: process.env.USERS_API_FUNC
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