/**
 * Property Duplication Fix
 * This script addresses the issue where 6 properties are shown in UI when only 3 exist in Atlas
 */

// Fix 1: Update PropertyListPage.jsx to prevent duplicate fetching
const propertyListPageFix = `
// In src/components/Property-list/PropertyListPage.jsx
// Replace the fetchMixedProperties function with this improved version:

const fetchMixedProperties = async () => {
  try {
    console.log('Fetching mixed properties...');
    
    // Fetch ALL properties in a single call instead of separate calls
    const response = await axios.get('/api/properties', {
      params: {
        page: 1,
        limit: 50, // Get more properties to ensure we have variety
        // Don't filter by offeringType - get all properties
      }
    });

    const allProperties = response.data?.data || [];
    console.log('Total properties fetched:', allProperties.length);
    
    // Remove duplicates based on _id
    const uniqueProperties = allProperties.filter((property, index, self) => 
      index === self.findIndex(p => p._id === property._id)
    );
    
    console.log('Unique properties after deduplication:', uniqueProperties.length);
    
    // Shuffle the array to mix different property types
    const shuffledProperties = uniqueProperties.sort(() => Math.random() - 0.5);
    
    // Update the mixedProperties state
    setMixedProperties(shuffledProperties);
    
  } catch (error) {
    console.error('Error fetching mixed properties:', error);
  }
};
`;

// Fix 2: Add deduplication utility function
const deduplicationUtility = `
// Create src/utils/propertyDeduplication.js

/**
 * Utility functions for handling property deduplication
 */

export const removeDuplicateProperties = (properties) => {
  if (!Array.isArray(properties)) return [];
  
  // Use Map to track unique properties by _id
  const uniquePropertiesMap = new Map();
  
  properties.forEach(property => {
    if (property && property._id) {
      // Only keep the first occurrence of each property
      if (!uniquePropertiesMap.has(property._id)) {
        uniquePropertiesMap.set(property._id, property);
      }
    }
  });
  
  return Array.from(uniquePropertiesMap.values());
};

export const logPropertyStats = (properties, source = 'unknown') => {
  console.log(\`Property stats for \${source}:\`);
  console.log(\`- Total properties: \${properties.length}\`);
  
  const offeringTypes = properties.reduce((acc, prop) => {
    const type = prop.offeringType || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  
  console.log('- By offering type:', offeringTypes);
  
  const propertyTypes = properties.reduce((acc, prop) => {
    const type = prop.propertyType || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  
  console.log('- By property type:', propertyTypes);
};
`;

// Fix 3: Update the property controller to add logging
const controllerLogging = `
// In src/controllers/propertyController.js
// Add this logging to the getAllProperties method:

getAllProperties = this.asyncHandler(async (req, res) => {
  // ... existing code ...
  
  // Add logging before executing query
  console.log('=== PROPERTY QUERY DEBUG ===');
  console.log('Query filters:', JSON.stringify(query));
  console.log('Expected to find properties matching these criteria');
  
  // Executing query
  const properties = await findQuery;
  
  // Add logging after executing query
  console.log('Properties found:', properties.length);
  console.log('Property IDs:', properties.map(p => p._id));
  console.log('Offering types:', properties.map(p => p.offeringType));
  console.log('=== END PROPERTY QUERY DEBUG ===');
  
  // ... rest of existing code ...
});
`;

console.log('Property Duplication Fix Created');
console.log('Apply these fixes to resolve the 6 vs 3 properties issue:');
console.log('1. Update fetchMixedProperties function');
console.log('2. Add deduplication utility');
console.log('3. Add controller logging for debugging');

module.exports = {
  propertyListPageFix,
  deduplicationUtility,
  controllerLogging
};
