beforeEach(() => {
    jest.resetModules();
    process.env = {
        AWS_REGION: 'us-east-1',
        DYNAMO_DB_TABLE: 'einthotel-booking-backend-dev-configs-api'
    };
});

// dont change this. this will create admin role
test('create configs country code', async () => {
    const func = require("../../src/configs-api");
    const body = JSON.stringify(
        {
            "id": "country_codes",
            "value": [
                {
                    "countryCode": "+94",
                    "country": "SriLanka"
                },
                {
                    "countryCode": "+1",
                    "country": "Canada"
                },
                {
                    "countryCode": "+61",
                    "country": "Australia"
                },
                {
                    "countryCode": "+49",
                    "country": "Germany"
                }
            ],
        }
    )
    const event = {
        resource: '/configs',
        httpMethod: 'POST',
        body: Buffer.from(body).toString('base64'),
        pathParameters: {},
        requestContext: {
            authorizer: {
                principalId: 'u1'
            }
        }
    };
    const acctual = await func.handler(event, {});
    console.log(acctual)
    expect(201).toEqual(acctual.statusCode);
}, 30000);

test('create configs room_type_facilities', async () => {
    const func = require("../../src/configs-api");
    const body = JSON.stringify(
        {
            "id": "room_type_facilities",
            "value": [
                "Air Conditioning",
                "Balcony",
                "Barbecue",
                "Bathroom",
                "Coffeemaker",
                "Dishwasher",
                "Free Parking",
                "Fridge",
                "Internet",
                "Mini Bar"
            ],
        }
    )
    const event = {
        resource: '/configs',
        httpMethod: 'POST',
        body: Buffer.from(body).toString('base64'),
        pathParameters: {},
        requestContext: {
            authorizer: {
                principalId: 'u1'
            }
        }
    };
    const acctual = await func.handler(event, {});
    console.log(acctual)
    expect(201).toEqual(acctual.statusCode);
}, 30000);