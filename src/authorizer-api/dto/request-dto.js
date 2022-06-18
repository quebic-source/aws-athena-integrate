class AuthCreateRequest {
    constructor({
                    principleId, resourcePath, resourceId, role
                }) {
        this.principleId = principleId;
        this.resourcePath = resourcePath;
        this.resourceId = resourceId;
        this.role = role;
    }
}

module.exports = {
    AuthCreateRequest
};