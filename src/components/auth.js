// Simplified auth component with one of each error/warning type
function authenticateUser(username, password, options, callback) {
  // max-params
  console.log('Authenticating user'); // no-console
  let result; // no-var
  // no-trailing-spaces (space after this line)

  // complexity and max-depth
  if (username) {
    if (password) {
      if (options) {
        // max-depth (3 levels)
        return callback(null, { token: 'abc' + 86400000 }); // no-magic-numbers
      }
    }
  }

  return result;
}

export { authenticateUser };
