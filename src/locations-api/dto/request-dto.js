class LocationCreateRequest {
    constructor({
                    appId, id, name, description
                }) {
        this.appId = appId;
        this.id = id;
        this.name = name;
        this.description = description;
    }
}

module.exports = {
    LocationCreateRequest,
};