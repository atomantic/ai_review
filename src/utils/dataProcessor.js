// Simplified data processor with key error types
function processUserData(data, options) {
  // max-params
  debugger; // no-debugger
  // no-trailing-spaces (space after this line)

  // Add complexity and max-depth
  if (data) {
    if (data.users) {
      if (data.users.length > 0) {
        // max-depth (3 levels)
        return data.users[0].age > 18 ? { adults: true } : {}; // no-magic-numbers
      }
    }
  }

  return {};
}

export { processUserData };
