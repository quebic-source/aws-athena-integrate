const { AppEntityBaseModel } = require('common-lib/model/app-base-model');

class Tax extends AppEntityBaseModel {
    constructor(request) {
        super(request);
        this.id = request.id;
        this.name = request.name;
        this.value = request.value;
        this.country = request.country;
        this.status = request.status;
    }
}

module.exports = {
    Tax
};