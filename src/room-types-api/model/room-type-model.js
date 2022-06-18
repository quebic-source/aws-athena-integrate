const { AppEntityBaseModel } = require('common-lib/model/app-base-model');

class Price {
    constructor({price, currency}) {
        this.price = price;
        this.currency = currency;
    }
}

class RoomAvailabilityStatus {
    PUBLISHED = 'PUBLISHED';
    NOT_PUBLISHED = 'NOT_PUBLISHED';
    AWAITING = 'AWAITING';
    ARCHIVED = 'ARCHIVED';
}

class RoomType extends AppEntityBaseModel {
    constructor(request) {
        super(request);
        this.name = request.name;
        this.subtitle = request.subtitle;
        this.alias = request.alias;
        this.description = request.description;
        this.maxChildren = request.maxChildren;
        this.maxAdults = request.maxAdults;
        this.numberOfRooms = request.numberOfRooms;
        this.pricePerNight = new Price(request.pricePerNight);
        this.facilities = request.facilities; // array of strings
        this.speciality = request.speciality;
        this.availabilityStatus = request.availabilityStatus;
    }
}

module.exports = {
    RoomType,
    RoomAvailabilityStatus,
    Price
};