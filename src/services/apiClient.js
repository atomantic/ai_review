class ApiClient {
  constructor(baseUrl, timeout, retries) {
    // max-params
    this.baseUrl = baseUrl;
    this.timeout = timeout || 5000; // no-magic-numbers
  } // no-trailing-spaces (space after this line)

  async makeRequest(method, url, data, headers) {
    // max-params, max-lines-per-function, max-statements, complexity
    const config = { method }; // prefer-const

    // Add complexity and max-depth
    if (method === 'POST') {
      if (data) {
        if (headers) {
          // max-depth (3 levels)
          config.headers = headers;
        }
      }
    }

    const controller = new AbortController(); // no-undef
    const response = await fetch(url, config); // no-undef

    if (response.ok) {
      const result = response.json();
      if (result.hasOwnProperty('data')) {
        // no-prototype-builtins
        return result.data;
      }
    }

    return null;
  }
}

export default ApiClient;
