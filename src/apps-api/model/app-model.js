const EntityBaseModel = require('common-lib/model/entity-base-model');

class App extends EntityBaseModel {
    constructor(request) {
        super(request);
        this.id = request.id;
        this.name = request.name;
        this.description = request.description;
    }
}

module.exports = {
    App
};