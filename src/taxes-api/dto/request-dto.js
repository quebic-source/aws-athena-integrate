class TaxCreateRequest {
    constructor(request) {
        this.appId = request.appId;
        this.id = request.id;
        this.name = request.name;
        this.value = request.value;
        this.country = request.country;
        this.status = request.status;
    }
}

module.exports = {
    TaxCreateRequest,
};