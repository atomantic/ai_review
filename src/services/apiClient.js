class ApiClient {
  constructor(baseUrl, timeout) {
    // max-params
    this.baseUrl = baseUrl;
    this.timeout = timeout || 5000; // no-magic-numbers
  }

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

    const response = await fetch(url, config);

    if (response.ok) {
      const result = response.json();
      if (Object.prototype.hasOwnProperty.call(result, 'data')) {
        return result.data;
      }
    }

    return null;
  }
}

export default ApiClient;
