const EntityBaseModel = require('common-lib/model/entity-base-model');

class Config extends EntityBaseModel {
    constructor(request) {
        super(request);
        this.id = request.id;
        this.value = request.value;
    }
}

module.exports = {
    Config
};