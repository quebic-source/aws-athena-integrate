const  { TEST_USER_ID }  = require("../consts/common-consts");

beforeEach(() => {
    jest.resetModules();
    process.env = {
        AWS_REGION: 'us-east-1',
        DYNAMO_DB_TABLE: 'einthotel-booking-backend-dev-room-types-api-db',
        AUTHORIZER_API_FUNC: 'einthotel-booking-backend-dev-authorizer-api'
    };
});

test('create success', async () => {
    const func = require("../../src/room-types-api");
    const body = JSON.stringify(
        {
            "name": "Room-Type-1",
            "subtitle": "Room-Type-1",
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
        resource: '/room-types',
        httpMethod: 'POST',
        body: Buffer.from(body).toString('base64'),
        pathParameters: {},
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