// Create mock implementations
const mockWorkflowRun = jest.fn();
const mockBuildWorkflow = jest.fn();
const mockRegisterWorkflow = jest.fn();
const mockConfigure = jest.fn();

// Mock response factory
export const createMockResponse = (success: boolean, data: any = {}, error: string = '') => ({
  success,
  ...(success ? { message: 'Operation successful', data } : { error, details: data }),
  _debug: process.env.NODE_ENV === 'development' ? { stepResults: {} } : undefined
});

// Mock validator responses
export const mockValidationResult = (valid: boolean, errors: any = {}) => ({
  valid,
  ...(valid ? {} : { errors })
});

// Mock the entire cliodot module
jest.mock('cliodot', () => {
  // Create mock validator decorator
  const mockValidator = (rules: any[], options?: any) => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      // Store validation rules for testing
      target.__validationRules = rules;
      target.__validationOptions = options;
      return descriptor;
    };
  };

  // Create mock connector decorator
  const mockConnector = (connectorId: string, action: string, config: any, options?: any) => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      target.__connectorConfig = { connectorId, action, config, options };
      return descriptor;
    };
  };

  // Create mock responder decorator
  const mockResponder = (type: string, config: any, options?: any) => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      target.__responderConfig = { type, config, options };
      return descriptor;
    };
  };

  // Create mock workflow decorator
  const mockWorkflow = (id: string, name: string) => {
    return (target: any) => {
      target.__workflowId = id;
      target.__workflowName = name;
      return target;
    };
  };

  // Create mock http decorator
  const mockHttp = (method: string, path: string) => {
    return (target: any) => {
      target.__httpMethod = method;
      target.__httpPath = path;
      return target;
    };
  };

  // Create mock step decorator
  const mockStep = (options?: any) => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      target.__stepConfig = options;
      return descriptor;
    };
  };

  // Mock variable helper
  const mockV = {
    body: (path: string) => `{{ body.${path} }}`,
    pathParam: (key: string) => `{{ pathParams.${key} }}`,
    query: (key: string) => `{{ query.${key} }}`,
    header: (key: string) => `{{ headers.${key} }}`,
    stepResult: (stepId: string, path?: string) => 
      path ? `{{ stepResults.${stepId}.${path} }}` : `{{ stepResults.${stepId} }}`,
    vars: (key: string) => `{{ vars.${key} }}`,
    env: (key: string) => `{{ env.${key} }}`,
    expr: (expression: string) => `{{ ${expression} }}`
  };

  // Create mock flosync object
  const mockFlosync = {
    configure: mockConfigure,
    register: mockRegisterWorkflow,
    run: mockWorkflowRun,
    workflow: jest.fn().mockReturnValue({
      http: jest.fn().mockReturnThis(),
      step: jest.fn().mockReturnThis(),
      build: jest.fn().mockReturnValue({})
    }),
    runConnector: jest.fn(),
    runFunction: jest.fn(),
    getClient: jest.fn().mockReturnValue({
      workflows: {
        run: jest.fn(),
        list: jest.fn()
      }
    })
  };

  // Mock ConnectorId enum
  const mockConnectorId = {
    Utility: {
      Random: 'utility.random',
      String: 'utility.string',
      DateTime: 'utility.date_time',
      Math: 'utility.math',
      Compare: 'utility.compare',
      Geo: 'utility.geo'
    },
    Auth: {
      Bearer: 'auth.bearer'
    }
  };

  return {
    flosync: mockFlosync,
    v: mockV,
    Workflow: mockWorkflow,
    Http: mockHttp,
    Connector: mockConnector,
    Validator: mockValidator,
    Responder: mockResponder,
    Step: mockStep,
    ConnectorId: mockConnectorId,
    buildWorkflowFromClass: mockBuildWorkflow,
    defineTypedConnector: jest.fn().mockReturnValue({
      id: 'paystack',
      actions: {
        initializeTransaction: 'Initialize Transaction',
        verifyTransaction: 'Verify Transaction'
      }
    }),
    defineCustomConnector: jest.fn().mockReturnValue({
      id: 'custom',
      actions: {}
    })
  };
});

export { mockWorkflowRun, mockBuildWorkflow, mockRegisterWorkflow, mockConfigure };
