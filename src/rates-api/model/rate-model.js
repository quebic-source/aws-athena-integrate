const { AppEntityBaseModel } = require('common-lib/model/app-base-model');

class Rate extends AppEntityBaseModel {
    constructor(request) {
        super(request);
        this.id = request.id;
        this.roomType = request.roomType;
        this.startDate = request.startDate;
        this.endDate = request.endDate;
        this.package = request.package;
        this.pricePerNight = request.pricePerNight;
        this.numOfPeople = request.numOfPeople;
        this.pricePerExtraAdultPernight = request.pricePerExtraAdultPernight;
        this.pricePerExtraChildPernight = request.pricePerExtraChildPernight;
        this.fixedSupplementPerStay = request.fixedSupplementPerStay;
        this.discount = request.discount;
        this.discountType = request.discountType;
        this.includedTax = request.includedTax;
        this.addedTaxes = request.addedTaxes;
        this.childrenRates = request.childrenRates;
    }
}

module.exports = {
    Rate
};