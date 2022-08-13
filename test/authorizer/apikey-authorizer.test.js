beforeEach(() => {
    jest.resetModules();
    process.env = {
        AWS_REGION: 'us-east-1',
        AWS_ACCOUNT_ID: '893502944061',
        ACCESS_KEY_SECRET: '1qaz2wsx'
    };
});

test('auth success', async () => {
    const fn = require("../../src/api-key-authorizer");
    const event = {
        headers: {
            'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21lcklkIjoiZWNtYV8xIiwicmVmIjoiYXRoZW5hLWRlbW8tZWNtYV8xLTE2ZXpjNSIsImtleSI6ImMyNDU2MjMyLTFjMzAtNGE0Ni04NWFjLTJhNWM5ZmQ4NTdhMiIsImlhdCI6MTY2MDM5MjExNX0.ZqMl5MpOdS_T4iBSV8NeLUpAz_76PgUQmiPVfyWJXZg'
        }
    };
    const callback = (error, success) => {
        console.log("callback", error, success)
        expect(error).toBeNull();
    }
    await fn.handler(event, {}, callback);
});