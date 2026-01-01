// Custom fetch using curl-cffi for TLS fingerprinting
export const yahooFinanceFetch: typeof fetch = async (input, init?) => {
  try {
    // Dynamically import curl-cffi (only on server side)
    const { fetch: curlFetch } = require('curl-cffi');
    
    const url = typeof input === 'string' ? input : input.url;
    
    const curlResponse = await curlFetch(url, {
      method: init?.method || 'GET',
      impersonate: 'chrome120',
    });
    
    // Convert curl-cffi response to standard Response
    return new Response(curlResponse.dataRaw, {
      status: curlResponse.status,
      statusText: curlResponse.status === 200 ? 'OK' : 'Error',
      headers: new Headers(curlResponse.headers),
    });
  } catch (error) {
    console.error('[Yahoo Finance Fetch Error]:', error);
    throw error;
  }
};
