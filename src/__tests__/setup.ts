process.env.PAYSTACK_SECRET_KEY = 'sk_test_mock_key_12345';
process.env.NODE_ENV = 'test';

jest.setTimeout(10000);

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});
