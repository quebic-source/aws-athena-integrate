const {
    ADMIN_ROLE
} = require("common-lib/consts/roles-const");
const UserService = require("./service/user-service");
const { UserCreateRequest } = require("./dto/request-dto");

const userService = new UserService();

const checkExistingUser = async userId => {
    try {
        const savedUser = await userService.getById(userId);
        return !savedUser;
    } catch (e) {
        return e.code === 404;
    }
}
exports.handler = async function (event, context, callback) {
    console.log("event", JSON.stringify(event));
    try {
        if (await checkExistingUser(event.userName)) {
            await userService.create(new UserCreateRequest({
                id: event.userName,
                email: event.request.userAttributes.email,
                name: event.request.userAttributes.name,
                phoneNumber: event.request.userAttributes['phone_number'],
                role: ADMIN_ROLE
            }))
        } else {
            console.log(`${event.userName} already exists`)
        }
        callback(null, event);
    } catch (err) {
        console.error('handler execution failed', err);
        callback('User confirmation failed', event);
    }
}