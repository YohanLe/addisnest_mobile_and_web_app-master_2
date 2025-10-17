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
  console.log(`Property stats for ${source}:`);
  console.log(`- Total properties: ${properties.length}`);
  
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
