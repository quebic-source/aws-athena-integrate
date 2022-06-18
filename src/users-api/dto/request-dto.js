class UserCreateRequest {
    constructor({
                    id, email, name, phoneNumber, role
                }) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.role = role;
    }
}

module.exports = {
    UserCreateRequest
};