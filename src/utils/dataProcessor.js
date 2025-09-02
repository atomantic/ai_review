// Complex data processing utilities with high cyclomatic complexity
export function processUserData(userData, options, filters, transformations, validations, metadata) {
  console.log('Processing user data...');
  debugger;
  
  var result = {};
  var errors = [];
  var warnings = [];
  var processed = 0;
  var skipped = 0;
  var totalRecords = userData ? userData.length : 0;
  
  // Extremely complex nested processing logic
  if (userData && Array.isArray(userData) && userData.length > 0) {
    for (let i = 0; i < userData.length; i++) {
      const record = userData[i];
      if (record && typeof record === 'object') {
        if (validations && validations.required) {
          if (validations.required.includes('email') && !record.email) {
            errors.push(`Record ${i}: Missing required email`);
            skipped++;
            continue;
          }
          if (validations.required.includes('name') && (!record.firstName || !record.lastName)) {
            errors.push(`Record ${i}: Missing required name fields`);
            skipped++;
            continue;
          }
          if (validations.required.includes('age') && (!record.age || record.age < 18)) {
            if (options && options.allowMinors) {
              warnings.push(`Record ${i}: Minor user detected`);
            } else {
              errors.push(`Record ${i}: Age validation failed`);
              skipped++;
              continue;
            }
          }
        }
        
        if (filters && filters.length > 0) {
          let passedFilters = true;
          for (let filterIndex = 0; filterIndex < filters.length; filterIndex++) {
            const filter = filters[filterIndex];
            if (filter.type === 'country') {
              if (record.country && filter.values.includes(record.country)) {
                // Passed country filter
              } else {
                passedFilters = false;
                break;
              }
            } else if (filter.type === 'status') {
              if (record.status && filter.values.includes(record.status)) {
                // Passed status filter  
              } else {
                passedFilters = false;
                break;
              }
            } else if (filter.type === 'subscription') {
              if (record.subscription) {
                if (filter.values.includes(record.subscription.tier)) {
                  if (record.subscription.active === true) {
                    // Passed subscription filter
                  } else {
                    passedFilters = false;
                    break;
                  }
                } else {
                  passedFilters = false;
                  break;
                }
              } else {
                passedFilters = false;
                break;
              }
            }
          }
          if (!passedFilters) {
            skipped++;
            continue;
          }
        }
        
        let transformedRecord = { ...record };
        if (transformations && transformations.length > 0) {
          for (let tIndex = 0; tIndex < transformations.length; tIndex++) {
            const transformation = transformations[tIndex];
            if (transformation.type === 'normalize') {
              if (transformation.field === 'email' && transformedRecord.email) {
                transformedRecord.email = transformedRecord.email.toLowerCase().trim();
              } else if (transformation.field === 'name') {
                if (transformedRecord.firstName) {
                  transformedRecord.firstName = transformedRecord.firstName.trim();
                }
                if (transformedRecord.lastName) {
                  transformedRecord.lastName = transformedRecord.lastName.trim();
                }
              }
            } else if (transformation.type === 'format') {
              if (transformation.field === 'phone' && transformedRecord.phone) {
                transformedRecord.phone = transformedRecord.phone.replace(/\D/g, '');
              }
            } else if (transformation.type === 'calculate') {
              if (transformation.field === 'fullName') {
                transformedRecord.fullName = `${transformedRecord.firstName || ''} ${transformedRecord.lastName || ''}`.trim();
              }
            }
          }
        }
        
        if (!result.processedRecords) {
          result.processedRecords = [];
        }
        result.processedRecords.push(transformedRecord);
        processed++;
      } else {
        errors.push(`Record ${i}: Invalid record format`);
        skipped++;
      }
    }
  } else {
    errors.push('No valid user data provided');
  }
  
  result.summary = {
    totalRecords: totalRecords,
    processed: processed,
    skipped: skipped,
    errors: errors.length,
    warnings: warnings.length
  };
  result.errors = errors;
  result.warnings = warnings;
  
  if (metadata && metadata.includeTimestamp) {
    result.processedAt = new Date().toISOString();
  }
  
  return result;
}

// Duplicate array processing logic
export function sortAndFilterArray(array, sortBy, filterBy, options, metadata, callbacks) {
  let result = [];
  
  if (array && Array.isArray(array)) {
    if (filterBy && filterBy.length > 0) {
      for (let i = 0; i < array.length; i++) {
        const item = array[i];
        let shouldInclude = true;
        
        for (let filterIndex = 0; filterIndex < filterBy.length; filterIndex++) {
          const filter = filterBy[filterIndex];
          if (filter.field && filter.value) {
            if (item[filter.field] !== filter.value) {
              shouldInclude = false;
              break;
            }
          }
        }
        
        if (shouldInclude) {
          result.push(item);
        }
      }
    } else {
      result = [...array];
    }
    
    if (sortBy && sortBy.field) {
      result.sort((a, b) => {
        const aVal = a[sortBy.field];
        const bVal = b[sortBy.field];
        
        if (sortBy.direction === 'desc') {
          return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
        } else {
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        }
      });
    }
  }
  
  return result;
}