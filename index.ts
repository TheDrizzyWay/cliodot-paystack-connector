import express, { Request, Response } from 'express';
import { buildWorkflowFromClass } from 'cliodot';
import paystackFlosync from './src/config/flosync-config';
import { registerPaystackConnector } from './src/connectors/paystack-connector';
import { PaystackInitializeWorkflow, PaystackVerifyWorkflow } from './src/workflows/paystack-workflow';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Register the Paystack connector
registerPaystackConnector();


// Build and register workflows
const initializeWorkflow = buildWorkflowFromClass(PaystackInitializeWorkflow);
const verifyWorkflow = buildWorkflowFromClass(PaystackVerifyWorkflow);

if (initializeWorkflow) {
  paystackFlosync.register(initializeWorkflow);
}
if (verifyWorkflow) {
  paystackFlosync.register(verifyWorkflow);
}

// Express routes that delegate to Cliodot workflows
app.post('/api/paystack/initialize', async (req: Request, res: Response) => {
    const result = await paystackFlosync.run('paystack-initialize', {
      body: req.body,
      headers: req.headers as Record<string, string>,
      query: req.query as Record<string, any>
    });
    res.json(result);
});

app.get('/api/paystack/verify/:reference', async (req: Request, res: Response) => {
    const result = await paystackFlosync.run('paystack-verify', {
      body: { reference: req.params.reference },
      pathParams: { reference: req.params.reference },
      headers: req.headers as Record<string, string>,
    });
    res.json(result);
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
