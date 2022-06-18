beforeEach(() => {
    jest.resetModules();
    process.env = {
        AWS_REGION: 'us-east-1',
        COGNITO_POOL_ID: 'us-east-1_2ijzX06H2',
        AWS_ACCOUNT_ID: '471391780895',
        AUTHORIZED_RESOURCES: '/projects/{id},',
        AUTHORIZER_API_FUNC: 'einthotel-booking-backend-dev-authorizer-api'
    };
    jest.setTimeout(30000);
});

test('auth success', async () => {
    const func = require("../../src/authorizer");
    const event = {
        "type": "REQUEST",
        "methodArn": "arn:aws:execute-api:us-east-1:893502944061:7inz3gq5nf/dev/PUT/projects/1",
        "resource": "/locations",
        "path": "/locations",
        "httpMethod": "POST",
        "headers": {
            "appid": "bXVjasFg_yz98oMwGVNgq",
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Authorization": "eyJraWQiOiJDOGdMcHBcL216akZ0RVNKMzFvRXJ5UERucG5xNHFDdnprdlwvUHJseGRHcVk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIyY2UxNjgxNC02MDliLTQwZDItODRjMi05M2IzZGRiYTA5ZTAiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV8yaWp6WDA2SDIiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiI0dXRkZWV0ZW82MmFxM3AzOWQwY3F1dDFnNCIsIm9yaWdpbl9qdGkiOiIyMzAwOWY0OC0xZTM2LTRkZmQtOWRkNy1lZDYzMjQ0M2I2Y2MiLCJldmVudF9pZCI6ImVlNjFiZjU0LTlmYTItNGVjZS1hZWY2LTVmYjM5MTAwY2YxOSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4gcGhvbmUgb3BlbmlkIHByb2ZpbGUgZW1haWwiLCJhdXRoX3RpbWUiOjE2NDg3NDAwOTYsImV4cCI6MTY0ODc0MzY5NiwiaWF0IjoxNjQ4NzQwMDk2LCJqdGkiOiIzM2JjMjI1Yi1lY2Y0LTQ4MDMtODJkMy02YmM1ZmYzZTJiZTciLCJ1c2VybmFtZSI6IjJjZTE2ODE0LTYwOWItNDBkMi04NGMyLTkzYjNkZGJhMDllMCJ9.LJzUcIBEFV-_Up0hcZ5ivv1qaBDiBI-ZCOqqL6FjLw75YwDsDHlJw2rWQPaY1-wqLaM19xSkmRZ5uF7sFMueg3reIqB-Id-c8fIlzLTwxUV7ZvZ9Tl58l6Ye4OtBKZjLctNVRFQqrh1syEpTaqg-iqA5B06yk3ktUy55kTilE3iu2eAK-FvPiW4O7Gx8RU1N10T_IzqNH-NM8azomFC4Fj3uDnul0aDZZqy6JYNydAAslaXLdnDh0whbPG5qRh-TqQVuZeAOAU7GFeCIi6GWIfUrNau1jDgbRWmzPI7_boC_MPbjHZHn_la06VkziZkcaAjFadthGih2O18aX0neqw",
        }
    };
    const callback = (error, success) => {
        console.log("callback", error, success)
        expect(error).toBeNull();
    }
    await func.handler(event, {}, callback);
});

test('auth invalid auth token', async () => {
    const func = require("../../src/authorizer");
    const event = {
        "type": "REQUEST",
        "methodArn": "arn:aws:execute-api:us-east-1:893502944061:7inz3gq5nf/dev/PUT/projects/1",
        "resource": "/projects/{id}",
        "path": "/projects/OaxuxlFL37e7HbjEeFNCC",
        "httpMethod": "PUT",
        "headers": {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Authorization": "XXXeyJraWQiOiJGbjdUZWlrU0JhSmlSMkRmTkVCcEY2a1VJejh2R0xNWVZHZTZRdGU3TWtrPSIsImFsZyI6IlJTMjU2In0.eyJvcmlnaW5fanRpIjoiMGYzMjM1ZDctYjk2My00ZTg1LWFlMjQtZmIxNGU3NDVmMGEyIiwic3ViIjoiMGFiMTlkYzctNzA5Mi00ODU0LTk1ZmQtYzNhODk1OTAyM2VjIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiBwaG9uZSBvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImF1dGhfdGltZSI6MTY0NzgzNzQwMCwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfV1NmMFVGY3J5IiwiZXhwIjoxNjQ3ODQxMDAwLCJpYXQiOjE2NDc4Mzc0MDAsInZlcnNpb24iOjIsImp0aSI6IjQ0MjQ0MTNmLWY2NzctNDk4NS1hZWQ3LWRkYThmZTU2MGM3NiIsImNsaWVudF9pZCI6IjNvMDVkOXAycmgyOXZubnJtcnRuM3Zlb3VpIiwidXNlcm5hbWUiOiIwYWIxOWRjNy03MDkyLTQ4NTQtOTVmZC1jM2E4OTU5MDIzZWMifQ.jXXp5qGqNI-bC-RMXKXMtT1vVaOYpaYi2h5u6r8EFgziGYnqIehUBYHoPuu-2WdfzFrbX3MmcHHlVnJoPAZ8EEAGlZfwn6SSpTjIxvil_DGDnxEqkqPRxKAYoQpmlFqeTloXJYgIZXTXAV_Mh-_MDbHsX2loAE9al2hzE5bW_Gjnrmrw0aq1idU4RIw9tAF49VNdEqbMEE0MT5kdzxdAuKBCDf0CSCXz58mr-IPRTmwedW01NZk1ePjK7Og40mbg-QVQj9X8YKsIMgorVRAA1BKJgCKg3-kQwIDtfRzNBfk6ifenWBUICa-2OmhKLpX93ayWCTWUWx1z6dTvhE5BtQ",
        }
    };
    const callback = (error, success) => {
        console.log("callback", error, success)
        expect(error).toBeNull();
    }
    await func.handler(event, {}, callback);
});

test('auth success not app based endpoint', async () => {
    const func = require("../../src/authorizer");
    const event = {
        "type": "REQUEST",
        "methodArn": "arn:aws:execute-api:us-east-1:893502944061:7inz3gq5nf/dev/PUT/projects/1",
        "resource": "/projects",
        "path": "/projects",
        "httpMethod": "PUT",
        "headers": {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Authorization": "eyJraWQiOiJGbjdUZWlrU0JhSmlSMkRmTkVCcEY2a1VJejh2R0xNWVZHZTZRdGU3TWtrPSIsImFsZyI6IlJTMjU2In0.eyJvcmlnaW5fanRpIjoiMGYzMjM1ZDctYjk2My00ZTg1LWFlMjQtZmIxNGU3NDVmMGEyIiwic3ViIjoiMGFiMTlkYzctNzA5Mi00ODU0LTk1ZmQtYzNhODk1OTAyM2VjIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiBwaG9uZSBvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImF1dGhfdGltZSI6MTY0NzgzNzQwMCwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfV1NmMFVGY3J5IiwiZXhwIjoxNjQ3ODQxMDAwLCJpYXQiOjE2NDc4Mzc0MDAsInZlcnNpb24iOjIsImp0aSI6IjQ0MjQ0MTNmLWY2NzctNDk4NS1hZWQ3LWRkYThmZTU2MGM3NiIsImNsaWVudF9pZCI6IjNvMDVkOXAycmgyOXZubnJtcnRuM3Zlb3VpIiwidXNlcm5hbWUiOiIwYWIxOWRjNy03MDkyLTQ4NTQtOTVmZC1jM2E4OTU5MDIzZWMifQ.jXXp5qGqNI-bC-RMXKXMtT1vVaOYpaYi2h5u6r8EFgziGYnqIehUBYHoPuu-2WdfzFrbX3MmcHHlVnJoPAZ8EEAGlZfwn6SSpTjIxvil_DGDnxEqkqPRxKAYoQpmlFqeTloXJYgIZXTXAV_Mh-_MDbHsX2loAE9al2hzE5bW_Gjnrmrw0aq1idU4RIw9tAF49VNdEqbMEE0MT5kdzxdAuKBCDf0CSCXz58mr-IPRTmwedW01NZk1ePjK7Og40mbg-QVQj9X8YKsIMgorVRAA1BKJgCKg3-kQwIDtfRzNBfk6ifenWBUICa-2OmhKLpX93ayWCTWUWx1z6dTvhE5BtQ",
        }
    };
    const callback = (error, success) => {
        console.log("callback", error, success)
        expect(error).toBeNull();
    }
    await func.handler(event, {}, callback);
});

test('auth fail unauth appid', async () => {
    const func = require("../../src/authorizer");
    const event = {
        "type": "REQUEST",
        "methodArn": "arn:aws:execute-api:us-east-1:893502944061:7inz3gq5nf/dev/PUT/projects/1",
        "resource": "/projects/{id}",
        "path": "/projects/1",
        "httpMethod": "PUT",
        "headers": {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Authorization": "eyJraWQiOiJGbjdUZWlrU0JhSmlSMkRmTkVCcEY2a1VJejh2R0xNWVZHZTZRdGU3TWtrPSIsImFsZyI6IlJTMjU2In0.eyJvcmlnaW5fanRpIjoiMGYzMjM1ZDctYjk2My00ZTg1LWFlMjQtZmIxNGU3NDVmMGEyIiwic3ViIjoiMGFiMTlkYzctNzA5Mi00ODU0LTk1ZmQtYzNhODk1OTAyM2VjIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiBwaG9uZSBvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImF1dGhfdGltZSI6MTY0NzgzNzQwMCwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfV1NmMFVGY3J5IiwiZXhwIjoxNjQ3ODQxMDAwLCJpYXQiOjE2NDc4Mzc0MDAsInZlcnNpb24iOjIsImp0aSI6IjQ0MjQ0MTNmLWY2NzctNDk4NS1hZWQ3LWRkYThmZTU2MGM3NiIsImNsaWVudF9pZCI6IjNvMDVkOXAycmgyOXZubnJtcnRuM3Zlb3VpIiwidXNlcm5hbWUiOiIwYWIxOWRjNy03MDkyLTQ4NTQtOTVmZC1jM2E4OTU5MDIzZWMifQ.jXXp5qGqNI-bC-RMXKXMtT1vVaOYpaYi2h5u6r8EFgziGYnqIehUBYHoPuu-2WdfzFrbX3MmcHHlVnJoPAZ8EEAGlZfwn6SSpTjIxvil_DGDnxEqkqPRxKAYoQpmlFqeTloXJYgIZXTXAV_Mh-_MDbHsX2loAE9al2hzE5bW_Gjnrmrw0aq1idU4RIw9tAF49VNdEqbMEE0MT5kdzxdAuKBCDf0CSCXz58mr-IPRTmwedW01NZk1ePjK7Og40mbg-QVQj9X8YKsIMgorVRAA1BKJgCKg3-kQwIDtfRzNBfk6ifenWBUICa-2OmhKLpX93ayWCTWUWx1z6dTvhE5BtQ",
        }
    };
    const callback = (error, success) => {
        console.log("callback", error, success)
        expect(error).toBeNull();
    }
    await func.handler(event, {}, callback);
});