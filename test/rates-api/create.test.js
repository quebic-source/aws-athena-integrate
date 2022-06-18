const  { TEST_USER_ID }  = require("../consts/common-consts");

beforeEach(() => {
    jest.resetModules();
    process.env = {
        AWS_REGION: 'us-east-1',
        DYNAMO_DB_TABLE: 'einthotel-booking-backend-dev-rates-api-db',
        AUTHORIZER_API_FUNC: 'einthotel-booking-backend-dev-authorizer-api'
    };
});

test('create success', async () => {
    const func = require("../../src/rates-api");
    const body = JSON.stringify(
        {
            "roomType": "<roomTypeId>",
            "startDate": "2022-06-09",
            "endDate": "2022-08-09",
            "package": "<packageId>",
            "pricePerNight": 2500,
            "numOfPeople": 5,
            "pricePerExtraAdultPernight": 800,
            "pricePerExtraChildPernight": 600,
            "fixedSupplementPerStay": "test",
            "discount": 2,
            "discountType": "rate", // fixed/rate
            "includedTax": "<taxId>",
            "addedTaxes": ["<taxId1>", "<taxId2>"],
            "childrenRates": [
                {
                    "ageMin": 1,
                    "ageMax": 3,
                    "price": 250
                },
                {
                    "ageMin": 1,
                    "ageMax": 3,
                    "price": 350
                }
            ]
        }
    )
    const event = {
        resource: '/rates',
        httpMethod: 'POST',
        body: Buffer.from(body).toString('base64'),
        pathParameters: {},
        headers: { appid: 'SdpZtPqwyEep4MkF9_uWb' },
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