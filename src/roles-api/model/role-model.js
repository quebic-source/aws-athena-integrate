const EntityBaseModel = require('common-lib/model/entity-base-model');

class Role extends EntityBaseModel {
    constructor(request) {
        super(request);
        this.id = request.id;
        this.name = request.name;
        this.permissions = request.permissions;
    }
}

module.exports = {
    Role
};