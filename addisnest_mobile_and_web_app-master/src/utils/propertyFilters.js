// Property Filters utility
// Contains reusable filter logic for property filtering across the application

// Builds query parameters for property filtering
export const buildQueryParams = (options) => {
  const {
    searchQuery = '',
    priceRange = 'any',
    propertyType = 'all',
    bedrooms = 'any',
    bathrooms = 'any',
    regionalState = 'all',
    sortBy = 'newest',
    offeringType = 'For Sale'
  } = options;

  // Process wildcard search - ensure * is preserved in the URL
  const processedSearchQuery = searchQuery.trim();
  
  const queryParams = new URLSearchParams();
  
  // Set for=rent or for=sale based on offeringType
  if (offeringType === 'For Rent') {
    queryParams.set('for', 'rent');
  } else {
    queryParams.set('for', 'sale');
  }
  
  // Add other filter parameters if they have values
  if (searchQuery) queryParams.set('search', searchQuery);
  if (priceRange && priceRange !== 'any') queryParams.set('priceRange', priceRange);
  if (propertyType && propertyType !== 'all') queryParams.set('propertyType', propertyType);
  if (bedrooms && bedrooms !== 'any') queryParams.set('bedrooms', bedrooms);
  if (bathrooms && bathrooms !== 'any') queryParams.set('bathrooms', bathrooms);
  if (regionalState && regionalState !== 'all') queryParams.set('regionalState', regionalState);
  if (sortBy && sortBy !== 'newest') queryParams.set('sortBy', sortBy);

  return queryParams;
};

// Apply filters and navigate to property list page
export const applyFilters = (navigate, options) => {
  const queryParams = buildQueryParams(options);
  navigate(`/property-list?${queryParams.toString()}`);
};

// Creates filter parameters for API requests
export const createFilterParams = (options) => {
  const {
    searchQuery = '',
    priceRange = 'any',
    propertyType = 'all',
    bedrooms = 'any',
    bathrooms = 'any',
    regionalState = 'all',
    sortBy = 'newest',
    offeringType = 'For Sale',
    page = 1,
    limit = 50
  } = options;
  
  // Determine the type based on offeringType
  const type = offeringType === 'For Rent' ? 'rent' : 'buy';
  
  return {
    type,
    page,
    limit,
    search: searchQuery,
    priceRange,
    propertyType,
    bedrooms,
    bathrooms,
    regionalState,
    sortBy,
    offeringType
  };
};

// Extract filter values from URL query parameters
export const parseQueryParams = (searchParams) => {
  const isRental = searchParams.get('for') === 'rent';
  
  return {
    searchQuery: searchParams.get('search') || '',
    priceRange: searchParams.get('priceRange') || 'any',
    propertyType: searchParams.get('propertyType') || 'all',
    bedrooms: searchParams.get('bedrooms') || 'any',
    bathrooms: searchParams.get('bathrooms') || 'any',
    regionalState: searchParams.get('regionalState') || 'all',
    sortBy: searchParams.get('sortBy') || 'newest',
    offeringType: isRental ? 'For Rent' : 'For Sale'
  };
};

// Filter options for dropdowns
export const FILTER_OPTIONS = {
  priceRanges: [
    { value: 'any', label: 'Any Price' },
    { value: '0-20000', label: 'ETB 0 - 20,000' },
    { value: '20000-1000000', label: 'ETB 20,000 - 1,000,000' },
    { value: '1000000-5000000', label: 'ETB 1,000,000 - 5,000,000' },
    { value: '5000000-10000000', label: 'ETB 5,000,000 - 10,000,000' },
    { value: '10000000-20000000', label: 'ETB 10,000,000 - 20,000,000' },
    { value: '20000000+', label: 'ETB 20,000,000+' }
  ],
  
  propertyTypes: [
    { value: 'all', label: 'All Types' },
    { value: 'Apartment', label: 'Apartment' },
    { value: 'House', label: 'House' },
    { value: 'Villa', label: 'Villa' },
    { value: 'Studio', label: 'Studio' },
    { value: 'Land', label: 'Land' }
  ],
  
  bedBathOptions: [
    { value: 'any', label: 'Any' },
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
    { value: '5', label: '5+' }
  ],
  
  regionalStates: [
    { value: 'all', label: 'All Regions' },
    { value: 'Addis Ababa City Administration', label: 'Addis Ababa City Administration' },
    { value: 'Afar Region', label: 'Afar Region' },
    { value: 'Amhara Region', label: 'Amhara Region' },
    { value: 'Benishangul-Gumuz Region', label: 'Benishangul-Gumuz Region' },
    { value: 'Dire Dawa City Administration', label: 'Dire Dawa City Administration' },
    { value: 'Gambela Region', label: 'Gambela Region' },
    { value: 'Harari Region', label: 'Harari Region' },
    { value: 'Oromia Region', label: 'Oromia Region' },
    { value: 'Sidama Region', label: 'Sidama Region' },
    { value: 'Somali Region', label: 'Somali Region' },
    { value: 'South Ethiopia Region', label: 'South Ethiopia Region' },
    { value: 'South West Ethiopia Peoples\' Region', label: 'South West Ethiopia Peoples\' Region' },
    { value: 'Tigray Region', label: 'Tigray Region' },
    { value: 'Central Ethiopia Region', label: 'Central Ethiopia Region' }
  ],
  
  sortOptions: [
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' }
  ]
};
