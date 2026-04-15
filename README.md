# Paystack Payment Integration with Cliodot SDK

## Overview
This project implements a robust payment processing service that integrates Paystack (a leading African payment gateway) with the Cliodot SDK. It provides two main endpoints for payment processing: transaction initialization and payment verification.

The implementation leverages the Cliodot SDK's powerful workflow engine to create type-safe, declarative payment workflows with built-in validation, transaction reference generation, and response transformation.

## Architecture & Approach
**Technology Stack**

Runtime: Node.js

Framework: Express.js

Language: TypeScript

SDK: Cliodot Flowsync v1.1.0

Payment Gateway: Paystack API

## Key Design Decisions
1. Workflow-First Architecture
Instead of writing imperative business logic, we defined declarative workflows using Cliodot's decorator-based system. Each workflow represents a complete business process with built-in steps for validation, transformation, and external API calls.

2. Type-Safe Connectors
Using Cliodot's defineTypedConnector, we created a fully typed Paystack connector with schema definitions for request/response shapes, enabling compile-time type checking and IDE autocomplete.

3. SDK-First Implementation
All business logic leverages Cliodot's built-in capabilities:

- Validation: @Validator decorator with some validation rules
- Reference Generation: utility.random connector for UUID generation
- API Integration: REST connector with automatic auth header injection
- Response Formatting: @Responder decorator with JSON transformation

4. Separation of Concerns
- Connectors Layer: Defines Paystack API connector (paystack-connector.ts)
- Workflows Layer: Business process definitions (paystack-workflow.ts)
- Transport Layer: Express route handlers (index.ts)

## Installation & Setup
**Prerequisites**

Node.js 16+

npm or yarn

Paystack account (test keys)

## Installation Steps
1. Clone the repository
```
git clone <repository-url>
cd cliodot-paystack-connector
```

2. Install dependencies
```
npm install
```

3. Configure environment variables
Create a .env file in the root directory and populate it using the format in the **.env.example** file

4. Build the project
```
npm run build
```
5. Start the server
**Development mode (with auto-reload)**
```
npm run dev
```

**Production mode**
```
npm start
```

## API Endpoints
1. Initialize Payment Transaction
Creates a new payment transaction and returns a Paystack checkout URL.

Endpoint: **POST** /api/paystack/initialize
Request Body:
```
{
  "email": "customer@example.com",
  "amount": 50000
}
```
2. Verify Payment Transaction
Verifies the status of a completed payment transaction.

Endpoint: **GET** /api/paystack/verify/:reference

URL Parameters:

reference (string): Transaction reference from initialization response


##References

[Cliodot SDK Documentation](https://docs.cliodot.com/docs/sdk-reference)

[Paystack API Documentation](https://paystack.com/docs/api)
