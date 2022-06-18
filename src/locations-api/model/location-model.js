const { AppEntityBaseModel } = require('common-lib/model/app-base-model');

class Location extends AppEntityBaseModel {
    constructor(request) {
        super(request);
        this.id = request.id;
        this.name = request.name;
        this.description = request.description;
    }
}

module.exports = {
    Location
};