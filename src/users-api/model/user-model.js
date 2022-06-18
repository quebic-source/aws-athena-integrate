const EntityBaseModel = require('common-lib/model/entity-base-model');
const {USER_STATES} = require("../const/user-const");

class User extends EntityBaseModel {
    constructor(request) {
        super(request);
        this.id = request.id;
        this.email = request.email;
        this.name = request.name;
        this.phoneNumber = request.phoneNumber;
        this.role = request.role;
        this.status = USER_STATES.ACTIVE // TODO
    }
}

module.exports = {
    User
};