const {USER_STATES} = require("../const/user-const");

class UserResponse {
    constructor({
                    id,
                    email,
                    name,
                    role,
                    phoneNumber = ' ',
                    status= USER_STATES.ACTIVE,
                    createdAt,
                    modifiedAt
                }) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.phoneNumber = phoneNumber;
        this.status = status;
        this.createdAt = createdAt;
        this.modifiedAt = modifiedAt;
    }
}

module.exports = {
    UserResponse
};