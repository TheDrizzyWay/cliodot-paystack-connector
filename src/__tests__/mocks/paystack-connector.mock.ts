export const mockPaystackResponses = {
  initializeSuccess: {
    status: true,
    message: 'Authorization URL created',
    data: {
      authorization_url: 'https://checkout.paystack.com/mock_123',
      access_code: 'mock_access_code',
      reference: 'mock_ref_123e4567-e89b-12d3-a456-426614174000'
    }
  },
  initializeFailure: {
    status: false,
    message: 'Invalid email address',
    data: null
  },
  verifySuccess: {
    status: true,
    message: 'Verification successful',
    data: {
      amount: 50000,
      currency: 'NGN',
      status: 'success',
      reference: 'mock_ref_123e4567-e89b-12d3-a456-426614174000',
      paid_at: '2024-01-15T10:30:00.000Z',
      customer: {
        email: 'test@example.com'
      }
    }
  },
  verifyFailure: {
    status: false,
    message: 'Transaction reference not found',
    data: null
  },
  verifyPending: {
    status: true,
    message: 'Verification successful',
    data: {
      amount: 50000,
      currency: 'NGN',
      status: 'pending',
      reference: 'mock_ref_123',
      paid_at: null,
      customer: {
        email: 'test@example.com'
      }
    }
  }
};

// Helper to create workflow execution results
export const createInitializeWorkflowResult = (reference?: string) => ({
  success: true,
  message: 'Payment initialized successfully',
  data: {
    authorization_url: 'https://checkout.paystack.com/mock_123',
    reference: reference || 'mock_ref_123e4567-e89b-12d3-a456-426614174000'
  }
});

export const createVerifyWorkflowResult = (status: string = 'success', reference?: string) => ({
  success: true,
  message: 'Payment verified successfully',
  data: {
    status,
    amount: 500,
    currency: 'NGN',
    customer_email: 'test@example.com',
    paid_at: status === 'success' ? '2024-01-15T10:30:00.000Z' : null,
    reference: reference || 'mock_ref_123e4567-e89b-12d3-a456-426614174000'
  }
});

export const createValidationErrorResult = (errors: Record<string, string>) => ({
  success: false,
  error: 'Validation failed',
  details: errors
});
