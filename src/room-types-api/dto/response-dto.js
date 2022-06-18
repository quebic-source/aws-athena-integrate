class RoomTypeResponse {
    constructor(request) {
        this.appId = request.appId;
        this.id = request.id;
        this.name = request.name;
        this.subtitle = request.subtitle;
        this.alias = request.alias;
        this.description = request.description;
        this.maxChildren = request.maxChildren;
        this.maxAdults = request.maxAdults;
        this.numberOfRooms = request.numberOfRooms;
        this.pricePerNight = request.pricePerNight;
        this.facilities = request.facilities; // array of strings
        this.speciality = request.speciality;
        this.availabilityStatus = request.availabilityStatus;
    }
}

module.exports = {
    RoomTypeResponse,
};