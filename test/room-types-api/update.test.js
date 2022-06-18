const  { TEST_USER_ID }  = require("../consts/common-consts");

beforeEach(() => {
    jest.resetModules();
    process.env = {
        AWS_REGION: 'us-east-1',
        DYNAMO_DB_TABLE: 'einthotel-booking-backend-dev-room-types-api-db',
        AUTHORIZER_API_FUNC: 'einthotel-booking-backend-dev-authorizer-api'
    };
});

test('update success', async () => {
    const func = require("../../src/room-types-api");
    const body = JSON.stringify(
        {
            "name": "Room-Type-1",
            "subtitle": "Room-Type-1 updated",
            "alias": "rt1",
            "description": "Room-Type-1",
            "maxChildren": 2,
            "maxAdults": 3,
            "numberOfRooms": 10,
            "pricePerNight": {
                "price": 5000,
                "currency": "LKR"
            },
            "facilities": ["Air Conditioning", "Barbecue"],
            "speciality": "Cottage On The Sea",
            "availabilityStatus": "PUBLISHED"
        }
    )
    const event = {
        resource: '/room-types/{roomTypeId}',
        httpMethod: 'PUT',
        body: Buffer.from(body).toString('base64'),
        pathParameters: {'roomTypeId': 'MqnU6hTDbcLpGLfi5ga7h'},
        headers: { appid: 'TewiuzHRfT-PvzEzU6V4F' },
        requestContext: {
            authorizer: {
                principalId: TEST_USER_ID
            }
        }
    };
    const acctual = await func.handler(event, {});
    console.log(acctual)
    expect(acctual.statusCode).toEqual(201);
}, 30000);