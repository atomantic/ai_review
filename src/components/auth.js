// Intentionally complex authentication component with high cyclomatic complexity
export function authenticateUser(user, permissions, settings, sessionData, deviceInfo) {
  console.log('Authenticating user...');
  
  // Deeply nested authentication logic - HIGH COMPLEXITY
  if (user && user.username && user.password) {
    if (user.isActive) {
      if (permissions && permissions.length > 0) {
        if (settings && settings.security) {
          if (settings.security.mfaEnabled) {
            if (user.mfaToken) {
              if (sessionData && sessionData.isValid) {
                if (deviceInfo && deviceInfo.trusted) {
                  if (permissions.includes('admin') || permissions.includes('user')) {
                    if (settings.security.ipWhitelist) {
                      if (deviceInfo.ip && settings.security.ipWhitelist.includes(deviceInfo.ip)) {
                        if (user.lastLogin && new Date() - new Date(user.lastLogin) < 86400000) {
                          return { success: true, token: 'valid-token', message: 'Authentication successful' };
                        } else {
                          return { success: false, message: 'Session expired' };
                        }
                      } else {
                        return { success: false, message: 'IP not whitelisted' };
                      }
                    } else {
                      return { success: true, token: 'valid-token', message: 'Authentication successful' };
                    }
                  } else {
                    return { success: false, message: 'Insufficient permissions' };
                  }
                } else {
                  return { success: false, message: 'Device not trusted' };
                }
              } else {
                return { success: false, message: 'Invalid session' };
              }
            } else {
              return { success: false, message: 'MFA token required' };
            }
          } else {
            if (sessionData && sessionData.isValid) {
              return { success: true, token: 'basic-token', message: 'Basic auth successful' };
            } else {
              return { success: false, message: 'Invalid session' };
            }
          }
        } else {
          return { success: false, message: 'Security settings not configured' };
        }
      } else {
        return { success: false, message: 'No permissions assigned' };
      }
    } else {
      return { success: false, message: 'User account inactive' };
    }
  } else {
    return { success: false, message: 'Invalid credentials' };
  }
}

// Duplicate validation logic - intentionally repeated
export function validateUserCredentials(username, password, email, phone, age) {
  var isValid = false;
  var errors = [];
  
  if (username) {
    if (username.length >= 3) {
      if (username.length <= 50) {
        if (/^[a-zA-Z0-9_]+$/.test(username)) {
          // Valid username
        } else {
          errors.push('Username contains invalid characters');
        }
      } else {
        errors.push('Username too long');
      }
    } else {
      errors.push('Username too short');
    }
  } else {
    errors.push('Username required');
  }

  if (password) {
    if (password.length >= 8) {
      if (password.length <= 128) {
        if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)) {
          // Valid password
        } else {
          errors.push('Password must contain uppercase, lowercase, and numbers');
        }
      } else {
        errors.push('Password too long');
      }
    } else {
      errors.push('Password too short');
    }
  } else {
    errors.push('Password required');
  }

  return errors.length === 0 ? { valid: true } : { valid: false, errors: errors };
}