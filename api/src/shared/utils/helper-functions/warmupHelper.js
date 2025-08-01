const functionNames = require("../enums/functionNamesEnum");
const ResponseStatus = require("../enums/responseStatusEnum");

const FUNCTION_ENDPOINTS = {
  [functionNames.getBusariesSummary]: { method: 'GET', route: 'bursaries-summary' },
  [functionNames.getUniversityCardData]: { method: 'GET', route: 'university-card-data' }
};

function isWarmupRequest(request) {
  const warmupHeader = request.headers.get("x-warmup");
  const warmupSecret = request.headers.get("x-warmup-secret");
  const expectedSecret = process.env.WARMUP_SECRET;

  if (
    warmupHeader === 'true' &&
    warmupSecret && expectedSecret && warmupSecret === expectedSecret
  ) {
    return true;
  }
  return false;
}

function handleWarmupRequest(request, context, functionName) {
  if (!isWarmupRequest(request)) {
    return null; 
  }
  
  context.log(`[WARMUP] Function ${functionName} called for warm-up`);
  
  return {
    status: ResponseStatus.SUCCESS,
    jsonBody: {
      message: 'Function warmed up successfully',
      function: functionName,
      timestamp: new Date().toISOString(),
      warmup: true
    }
  };
}

async function callFunctionEndpoint(functionName, baseUrl = process.env.WEBSITE_URL) {
  const endpoint = FUNCTION_ENDPOINTS[functionName];
  if (!endpoint) {
    throw new Error(`No endpoint configuration found for function: ${functionName}`);
  }

  const url = `${baseUrl}api/${endpoint.route}?isWarmUp=true`;
  
  try {
    const response = await fetch(url, {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
        'x-warmup': 'true',
        'x-warmup-secret': process.env.WARMUP_SECRET,
      },
      timeout: 30000 
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return {
      success: true,
      status: response.status,
      duration: 0 
    };
  } catch (error) {
    throw new Error(`Function call failed: ${error.message}`);
  }
}

async function warmupFunction(functionName) {
  try {
    const result = await callFunctionEndpoint(functionName)
    return { success: true, status: result.status };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = {
  warmupFunction,
  isWarmupRequest,
  handleWarmupRequest,
  FUNCTION_ENDPOINTS
}; 