import {
  v, 
  Workflow, 
  Http, 
  Connector, 
  Validator, 
  Responder,
  StepOutput,
  ConnectorId
} from 'cliodot';
import type { WorkflowContext } from 'cliodot';
import { PaystackConnector, InitializeResponse, VerifyResponse } from '../connectors/paystack-connector';

/**
 * Workflow: Initialize a Paystack transaction
 * - Validates required inputs (email, amount)
 * - Generates unique transaction reference using SDK utility
 * - Calls Paystack API to initialize payment
 */
@Workflow("paystack-initialize", "Initialize Paystack Payment")
@Http("POST", "/api/paystack/initialize")
export class PaystackInitializeWorkflow {
  
  @Validator([
    {
      fields: [v.body("email")],
      validators: [
        { name: "required", config: { message: "Email is required" } },
        { name: "is_email", config: { message: "Valid email is required" } }
      ]
    },
    {
      fields: [v.body("amount")],
      validators: [
        { name: "required", config: { message: "Amount is required" } },
        { name: "is_number", config: { message: "Amount must be a number" } },
        { name: "greater_than", config: { value: 0, message: "Amount must be greater than 0" } }
      ]
    }
  ], { order: 0, stage: "post", then: "generateReference", else: "validationError" })
  validate() {}

  @Responder("json", { 
    statusCode: 400,
    body: { 
      success: false,
      error: "Validation failed", 
      details: v.stepResult("validate", "errors") 
    } 
  }, { order: 1 })
  validationError() {}

  // Generate unique transaction reference
  @Connector(ConnectorId.Utility.Random, "random_uuid", {}, { order: 2 })
  generateReference() {}

  @Connector(
    PaystackConnector.id,
    PaystackConnector.actions.initializeTransaction,
    { 
      body: { 
        email: v.body("email"), 
        amount: v.body("amount"),
        reference: v.stepResult("generateReference", "value"),
        callback_url: v.body("callback_url"),
        metadata: v.body("metadata")
      } 
    },
    { order: 3, then: "respond", else: "initError" }
  )
  initialize(ctx: WorkflowContext<InitializeResponse>): StepOutput<{ 
    authorization_url: string; 
    reference: string;
    access_code: string;
  }> {
    // Transform the response to a cleaner format
    return {
      out: {
        authorization_url: ctx.input.data.authorization_url,
        reference: ctx.input.data.reference,
        access_code: ctx.input.data.access_code,
      },
      setVars: {
        payment_reference: ctx.input.data.reference,
        initialized_at: new Date().toISOString()
      }
    };
  }

  @Responder("json", { 
    body: { 
      success: true,
      message: "Payment initialized successfully",
      data: {
        authorization_url: v.stepResult("initialize", "authorization_url"),
        reference: v.stepResult("initialize", "reference"),
      }
    } 
  }, { order: 4 })
  respond() {}

  @Responder("json",{
      statusCode: 400,
      body: {
        message: "Payment initialization failed",
        data: v.stepResult("initialize"),
      },
    },
    { order: 5 }
  )
  initError() {}
}

/**
 * Workflow: Verify a Paystack transaction
 * - Validates reference parameter
 * - Calls Paystack API to verify payment status
 */
@Workflow("paystack-verify", "Verify Paystack Payment")
@Http("GET", "/api/paystack/verify/:reference")
export class PaystackVerifyWorkflow {

  @Validator([
    {
      fields: [v.pathParam("reference")],
      validators: [
        { name: "required", config: { message: "Transaction reference is required" } }
      ]
    }
  ], { order: 0, then: "verifyTransaction", else: "validationError" })
  validate() {}

  @Responder("json", { 
    statusCode: 400,
    body: { 
      success: false,
      error: "Validation failed", 
      details: v.stepResult("validate", "errors") 
    } 
  }, { order: 1 })
  validationError() {}

  @Connector(
    PaystackConnector.id,
    PaystackConnector.actions.verifyTransaction,
    { 
      pathParams: { reference: v.pathParam("reference") }
    },
    { order: 2, then: "respond", else: "verifyError" }
  )
  verifyTransaction(ctx: WorkflowContext<VerifyResponse>): StepOutput<{
    status: string;
    amount: number;
    currency: string;
    customer_email: string;
    paid_at: string;
    reference: string;
  }> {
    const { data } = ctx.input;
    return {
      out: {
        status: data.status,
        amount: data.amount,
        currency: data.currency,
        customer_email: data.customer.email,
        paid_at: data.paid_at,
        reference: data.reference,
      },
      setVars: {
        verified_at: new Date().toISOString(),
        payment_status: data.status
      }
    };
  }

  @Responder("json", { 
    body: { 
      success: true,
      message: "Payment verified successfully",
      data: v.stepResult("verifyTransaction")
    } 
  }, { order: 3 })
  respond() {}

  @Responder("json",{
      statusCode: 400,
      body: {
        message: "Payment verification failed",
        data: v.stepResult("verifyTransaction"),
      },
    },
    { order: 4 }
  )
  initError() {}
}