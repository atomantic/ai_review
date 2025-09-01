// Main entry point with mixed code issues
import { authenticateUser, validateUserCredentials } from './components/auth.js';
import { processUserData, sortAndFilterArray } from './utils/dataProcessor.js';
import { ApiClient } from './services/apiClient.js';

console.log('Starting AI Review Demo Application...');

// Sample usage with intentional complexity
function main() {
  const sampleUser = {
    username: 'testuser',
    password: 'TestPass123',
    isActive: true,
    mfaToken: 'abc123',
    lastLogin: new Date().toISOString(),
    email: 'test@example.com'
  };
  
  const permissions = ['user', 'read'];
  const settings = {
    security: {
      mfaEnabled: true,
      ipWhitelist: ['127.0.0.1', '192.168.1.1']
    }
  };
  
  const sessionData = { isValid: true };
  const deviceInfo = { trusted: true, ip: '127.0.0.1' };
  
  // Test authentication
  const authResult = authenticateUser(sampleUser, permissions, settings, sessionData, deviceInfo);
  console.log('Auth result:', authResult);
  
  // Test validation
  const validationResult = validateUserCredentials(
    sampleUser.username, 
    sampleUser.password, 
    sampleUser.email,
    '+1234567890',
    25
  );
  console.log('Validation result:', validationResult);
  
  // Test data processing
  const userData = [
    { firstName: 'John', lastName: 'Doe', email: 'john@example.com', age: 30, country: 'US', status: 'active' },
    { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', age: 25, country: 'CA', status: 'active' }
  ];
  
  const processResult = processUserData(
    userData,
    { allowMinors: false },
    [{ type: 'country', values: ['US', 'CA'] }],
    [{ type: 'normalize', field: 'email' }, { type: 'calculate', field: 'fullName' }],
    { required: ['email', 'name'] },
    { includeTimestamp: true }
  );
  console.log('Process result:', processResult);
  
  // Test API client
  const apiClient = new ApiClient('https://api.example.com', 'test-key', 5000);
  
  // This would make a real request in production
  console.log('API client initialized');
}

main();