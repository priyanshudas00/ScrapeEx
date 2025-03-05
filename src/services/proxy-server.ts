import axios from 'axios';

// Define multiple proxy services to try
const PROXY_SERVICES = [
  {
    name: 'allOrigins',
    url: 'https://api.allorigins.win/raw?url=',
    paramStyle: 'append' // URL is appended directly
  },
  {
    name: 'corsAnywhere',
    url: 'https://cors-anywhere.herokuapp.com/',
    paramStyle: 'prepend' // URL is prepended
  },
  {
    name: 'corsproxy',
    url: 'https://corsproxy.io/?',
    paramStyle: 'append'
  }
];

export async function fetchWithProxy(url: string): Promise<string> {
  // Ensure URL has protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  // Encode the URL for safety
  const encodedUrl = encodeURIComponent(url);
  
  // Try each proxy service until one works
  let lastError = null;
  
  for (const proxy of PROXY_SERVICES) {
    try {
      let proxyUrl = '';
      
      if (proxy.paramStyle === 'append') {
        proxyUrl = `${proxy.url}${encodedUrl}`;
      } else {
        proxyUrl = `${proxy.url}${url}`;
      }
      
      const response = await axios.get(proxyUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'X-Requested-With': 'XMLHttpRequest'
        },
        timeout: 15000 // 15 second timeout
      });
      
      return response.data;
    } catch (error) {
      lastError = error;
      console.warn(`Proxy ${proxy.name} failed:`, error instanceof Error ? error.message : 'Unknown error');
      // Continue to the next proxy
    }
  }
  
  // If we get here, all proxies failed
  const errorMessage = lastError instanceof Error ? lastError.message : 'All proxy services failed';
  console.error('All proxy services failed:', errorMessage);
  throw new Error(`Unable to fetch content: ${errorMessage}`);
}

// Fallback to direct fetch if all proxies fail (for development only)
export async function fetchDirect(url: string): Promise<string> {
  try {
    // Ensure URL has protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Direct fetch failed: ${errorMessage}`);
  }
}