const { AppEntityBaseModel } = require('common-lib/model/app-base-model');

class Package extends AppEntityBaseModel {
    constructor(request) {
        super(request);
        this.id = request.id;
        this.name = request.name;
        this.days = request.days || [];
        this.checkIn = request.checkIn;
        this.checkOut = request.checkOut;
        this.minNights = request.minNights;
        this.maxNights = request.maxNights;
    }
}

module.exports = {
    Package
};