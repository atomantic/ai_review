// API client with nested conditionals and code duplication
export class ApiClient {
  constructor(baseUrl, apiKey, timeout, retryConfig, authConfig) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.timeout = timeout || 5000;
    this.retryConfig = retryConfig;
    this.authConfig = authConfig;
  }
  
  // Extremely complex request method with high cyclomatic complexity
  async makeRequest(endpoint, method, data, headers, options, retryAttempt = 0) {
    console.log(`Making ${method} request to ${endpoint}`);
    
    if (!endpoint || typeof endpoint !== 'string') {
      throw new Error('Invalid endpoint provided');
    }
    
    if (!method || typeof method !== 'string') {
      throw new Error('Invalid method provided');
    }
    
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    if (!validMethods.includes(method.toUpperCase())) {
      throw new Error('Invalid HTTP method');
    }
    
    let requestHeaders = { 'Content-Type': 'application/json' };
    
    if (this.authConfig) {
      if (this.authConfig.type === 'bearer') {
        if (this.authConfig.token) {
          requestHeaders['Authorization'] = `Bearer ${this.authConfig.token}`;
        } else {
          throw new Error('Bearer token not provided');
        }
      } else if (this.authConfig.type === 'api-key') {
        if (this.apiKey) {
          requestHeaders['X-API-Key'] = this.apiKey;
        } else {
          throw new Error('API key not provided');
        }
      } else if (this.authConfig.type === 'basic') {
        if (this.authConfig.username && this.authConfig.password) {
          const credentials = Buffer.from(`${this.authConfig.username}:${this.authConfig.password}`).toString('base64');
          requestHeaders['Authorization'] = `Basic ${credentials}`;
        } else {
          throw new Error('Basic auth credentials not provided');
        }
      }
    }
    
    if (headers && typeof headers === 'object') {
      requestHeaders = { ...requestHeaders, ...headers };
    }
    
    let requestConfig = {
      method: method.toUpperCase(),
      headers: requestHeaders
    };
    
    if (data) {
      if (method.toUpperCase() === 'GET') {
        // Convert data to query string for GET requests
        const queryString = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
        endpoint = `${endpoint}${endpoint.includes('?') ? '&' : '?'}${queryString}`;
      } else {
        if (typeof data === 'object') {
          requestConfig.body = JSON.stringify(data);
        } else {
          requestConfig.body = data;
        }
      }
    }
    
    const fullUrl = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      requestConfig.signal = controller.signal;
      
      const response = await fetch(fullUrl, requestConfig);
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const jsonData = await response.json();
          
          if (options && options.validateResponse) {
            if (options.requiredFields && Array.isArray(options.requiredFields)) {
              for (let fieldIndex = 0; fieldIndex < options.requiredFields.length; fieldIndex++) {
                const field = options.requiredFields[fieldIndex];
                if (!jsonData.hasOwnProperty(field)) {
                  throw new Error(`Response missing required field: ${field}`);
                }
              }
            }
            
            if (options.expectedFormat) {
              if (options.expectedFormat === 'array' && !Array.isArray(jsonData)) {
                throw new Error('Response is not an array');
              } else if (options.expectedFormat === 'object' && (typeof jsonData !== 'object' || Array.isArray(jsonData))) {
                throw new Error('Response is not an object');
              }
            }
          }
          
          return {
            success: true,
            data: jsonData,
            status: response.status,
            headers: Object.fromEntries(response.headers.entries())
          };
        } else {
          const textData = await response.text();
          return {
            success: true,
            data: textData,
            status: response.status,
            headers: Object.fromEntries(response.headers.entries())
          };
        }
      } else {
        if (this.retryConfig && retryAttempt < this.retryConfig.maxRetries) {
          if (this.retryConfig.retryableStatuses && this.retryConfig.retryableStatuses.includes(response.status)) {
            const delay = this.retryConfig.baseDelay * Math.pow(2, retryAttempt);
            await new Promise(resolve => setTimeout(resolve, delay));
            return this.makeRequest(endpoint, method, data, headers, options, retryAttempt + 1);
          }
        }
        
        const errorData = await response.text();
        return {
          success: false,
          error: errorData,
          status: response.status,
          headers: Object.fromEntries(response.headers.entries())
        };
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        if (this.retryConfig && retryAttempt < this.retryConfig.maxRetries) {
          const delay = this.retryConfig.baseDelay * Math.pow(2, retryAttempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.makeRequest(endpoint, method, data, headers, options, retryAttempt + 1);
        }
        
        return {
          success: false,
          error: 'Request timeout',
          status: 408
        };
      }
      
      return {
        success: false,
        error: error.message,
        status: 500
      };
    }
  }
  
  // Duplicate GET method - intentionally similar to makeRequest
  async get(endpoint, params, headers, options) {
    if (!endpoint) {
      throw new Error('Endpoint required');
    }
    
    let url = `${this.baseUrl}${endpoint}`;
    
    if (params && typeof params === 'object') {
      const queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
      url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
    }
    
    let requestHeaders = {
      'Content-Type': 'application/json'
    };
    
    if (this.apiKey) {
      requestHeaders['X-API-Key'] = this.apiKey;
    }
    
    if (headers) {
      requestHeaders = { ...requestHeaders, ...headers };
    }
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: requestHeaders
      });
      
      if (response.ok) {
        const data = await response.json();
        return { success: true, data: data };
      } else {
        return { success: false, error: await response.text() };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // Duplicate POST method  
  async post(endpoint, data, headers, options) {
    if (!endpoint) {
      throw new Error('Endpoint required');
    }
    
    let requestHeaders = {
      'Content-Type': 'application/json'
    };
    
    if (this.apiKey) {
      requestHeaders['X-API-Key'] = this.apiKey;
    }
    
    if (headers) {
      requestHeaders = { ...requestHeaders, ...headers };
    }
    
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        const responseData = await response.json();
        return { success: true, data: responseData };
      } else {
        return { success: false, error: await response.text() };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}