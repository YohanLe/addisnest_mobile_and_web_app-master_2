# Admin Location Filter Implementation

This document outlines the implementation of regional state/location filtering in the admin listings page.

## Overview

The location filter allows administrators to filter property listings based on their regional state/location. This feature enhances the admin experience by making it easier to manage properties in specific regions.

## Implementation Details

### 1. Component Changes

The following changes were made to the `ManageListings.jsx` component:

- Added new state variables:
  - `locationFilter`: Stores the currently selected location filter value
  - `availableLocations`: Stores the list of unique locations extracted from property data

- Updated the `useEffect` hook to re-fetch listings when the location filter changes

- Added a function to handle location filter changes:
  - `handleLocationFilterChange`: Updates the location filter state and resets pagination

- Modified the `fetchListings` function to:
  - Extract unique locations from property data
  - Apply location filtering based on the selected location

- Added a new location filter dropdown to the UI that:
  - Shows "All Locations" as the default option
  - Dynamically populates with available locations from the property data
  - Triggers filtering when a location is selected

### 2. CSS Changes

The following changes were made to the `admin.css` file:

- Enhanced the `.admin-filter-select` class to:
  - Use flexbox for better alignment of multiple select elements
  - Add proper spacing between filter dropdowns
  - Ensure consistent styling across all filter elements

- Added specific styling for the `.location-filter` class to:
  - Set appropriate margins
  - Ensure proper sizing and alignment with other filter elements

## How It Works

1. When the admin listings page loads, it fetches all properties
2. The component extracts unique location values from the property data
3. These locations are displayed in a dropdown filter
4. When an admin selects a location from the dropdown:
   - The component filters the listings to show only properties in that location
   - The table updates to display the filtered results
   - Pagination is reset to the first page

5. When "All Locations" is selected, the location filter is removed, and all properties are displayed (subject to other active filters)

## Testing

A test script (`test-admin-location-filter.js`) has been provided to verify the functionality of the location filter. The script:

1. Logs in to the admin panel
2. Navigates to the listings page
3. Verifies that the location filter is present
4. Tests filtering for each available location
5. Verifies that the filtered results match the selected location

### Prerequisites

The test script uses Playwright for browser automation. If you don't have Playwright installed, you can install it using the provided batch file:

```
install-playwright.bat
```

This will install Playwright and the Chromium browser required for testing.

### Running the Test

To run the test:

1. Ensure the application is running (`npm run dev`)
2. Run the test script: `node test-admin-location-filter.js`

Alternatively, use the provided batch file to start the application and run the test automatically:

```
run-admin-location-filter-test.bat
```

## Notes

- The location filter works in conjunction with other filters (status, search)
- The filter uses the `state` property from the property's address object
- Empty or undefined location values are excluded from the filter dropdown
- The filter is case-sensitive and matches exact location names
