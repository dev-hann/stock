// Use standard fetch - yahoo-finance2 handles the requests internally
export const yahooFinanceFetch: typeof fetch = async (input, init?) => {
  const url = typeof input === 'string' ? input : input.url;
  
  console.log('[Yahoo Finance Fetch] URL:', url);
  
  try {
    // Use native fetch with custom headers
    const response = await fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    
    console.log('[Yahoo Finance Fetch] Status:', response.status);
    
    return response;
  } catch (error) {
    console.error('[Yahoo Finance Fetch Error]:', error);
    throw error;
  }
};
