const EntityBaseModel = require('common-lib/model/entity-base-model');

class AuthModel extends EntityBaseModel {
    constructor(request) {
        super(request);
        this.userId = request.userId;
        this.resourcePath = request.resourcePath;
        this.resourceId = request.resourceId;
        this.role = request.role;
    }
}

module.exports = {
    AuthModel
};