const { createUniqueId } = require('common-lib/utils/object-utils');

class ChildrenRate {
    constructor(request) {
        this.id = request.id;
        this.ageMin = request.ageMin;
        this.ageMax = request.ageMax;
        this.price = request.price;
    }
}


class RateCreateRequest {
    constructor(request) {
        this.appId = request.appId;
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

        this.childrenRates = [];
        if (request.childrenRates && request.childrenRates.length > 0) {
            for (const rate of request.childrenRates) {
                rate.id = createUniqueId();
                this.childrenRates.push(new ChildrenRate(rate));
            }
        }
    }
}

module.exports = {
    RateCreateRequest,
    ChildrenRate
};