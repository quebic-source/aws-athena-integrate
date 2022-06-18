class PackageResponse {
    constructor(request) {
        this.appId = request.appId;
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
    PackageResponse,
};