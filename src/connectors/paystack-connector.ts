import { 
  defineTypedConnector, 
  ConnectorResponse,
  ConnectorBody,
  ConnectorPathParams, 
} from 'cliodot';
import paystackFlosync from '../config/flosync-config';
import { PAYSTACK_SECRET_KEY } from '../config/env-vars';

// Define typed Paystack connector with schema validation
export const PaystackConnector = defineTypedConnector("paystack", {
  initializeTransaction: "Initialize Transaction",
  verifyTransaction: "Verify Transaction",
}, {
  initializeTransaction: {
    body: {} as { 
      email: string; 
      amount: number; 
      reference?: string;
      callback_url?: string;
      metadata?: Record<string, any>;
    },
    response: {} as { 
      status: boolean;
      message: string;
      data: {
        authorization_url: string;
        access_code: string;
        reference: string;
      }
    },
  },
  verifyTransaction: {
    pathParams: {} as { reference: string },
    response: {} as {
      status: boolean;
      message: string;
      data: {
        amount: number;
        currency: string;
        status: string;
        reference: string;
        paid_at: string;
        customer: {
          email: string;
        }
      }
    },
  },
});

// Register the Paystack REST connector
export function registerPaystackConnector() {
  const paystackConnector = {
    _id: PaystackConnector.id,
    type: 'REST' as const,
    name: 'Paystack Payment Gateway',
    description: 'Paystack payment integration connector',
    base_url: 'https://api.paystack.co',
    auth: { 
      type: 'bearer' as const, 
      token: PAYSTACK_SECRET_KEY || '',
      header_name: 'Authorization',
      prefix: 'Bearer '
    },
    endpoints: [
      { 
        name: PaystackConnector.actions.initializeTransaction, 
        method: 'POST', 
        path: '/transaction/initialize',
        headers: { 'Content-Type': 'application/json' }
      },
      { 
        name: PaystackConnector.actions.verifyTransaction, 
        method: 'GET', 
        path: '/transaction/verify/:reference'
      }
    ]
  };

  // Register the connector with flosync
  paystackFlosync.registerConnector(paystackConnector._id, paystackConnector);
  console.log('Paystack connector registered successfully');
}

export type InitializeResponse = ConnectorResponse<typeof PaystackConnector, "initializeTransaction">;
export type VerifyResponse = ConnectorResponse<typeof PaystackConnector, "verifyTransaction">;
export type InitializeBody = ConnectorBody<typeof PaystackConnector, "initializeTransaction">;
export type VerifyPathParams = ConnectorPathParams<typeof PaystackConnector, "verifyTransaction">;
