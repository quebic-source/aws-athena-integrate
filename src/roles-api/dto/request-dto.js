class RoleCreateRequest {
    constructor({
                    id, name, permissions
                }) {
        this.id = id;
        this.name = name;
        this.permissions = permissions;
    }
}

module.exports = {
    RoleCreateRequest
};