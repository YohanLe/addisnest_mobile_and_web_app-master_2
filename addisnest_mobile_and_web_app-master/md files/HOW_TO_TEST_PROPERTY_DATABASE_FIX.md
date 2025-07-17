# How to Test Property Detail Database Field Mapping Fix

This guide explains how to test the property detail database field mapping fix to ensure that property details are correctly displayed from the database.

## Prerequisites

- Node.js installed
- npm installed
- MongoDB connection configured in your environment

## Running the Test

1. Open a terminal in the project directory.
2. Run the test script using the provided batch file:

```
run-property-database-fix-test.bat
```

This will:
- Start the backend server (if not already running)
- Start the frontend development server
- Open a browser window with the property detail debug page

## Debug View

The test uses a special debug view that displays:
1. All property data retrieved from the database
2. How the different fields are mapped
3. Raw JSON output of the property object

This helps identify if:
- Data is being retrieved from the database correctly
- Field mapping is working as expected
- Any fields are missing or improperly formatted

## Expected Results

The debug page should display the property details with these values:

- **Title**: "Test Property With Fixed Image URLs"
- **Property Type**: "House"
- **Property For**: "For Sale"
- **Location**: "Addis Ababa, Ethiopia"
- **Price**: 1,000,000
- **Bedrooms**: 3
- **Bathrooms**: 2
- **Size**: 100 sqm
- **Furnishing**: "Furnished"

## Testing the Regular View

After verifying the data is being retrieved correctly in the debug view, you can test the regular property detail view:

1. Change the URL from `/debug/property/[ID]` to `/property/[ID]`
2. Verify that all property details are displayed correctly in the regular view
3. Check that images, amenities, and other property details appear properly

## Troubleshooting

If the debug view shows an error or missing data:

1. **API Error**: Check the console logs for any errors in the API request
2. **Database Connection**: Verify your MongoDB connection is working correctly
3. **Property ID**: Ensure you're using a valid property ID that exists in the database
4. **Field Mapping**: If data is retrieved but not displayed correctly, check the field mapping in the PropertyDetail component

## Advanced Debugging

For more detailed debugging:

1. Check the server console for API errors
2. Examine the browser's network tab to see the API response
3. Compare the raw JSON output in the debug view with the expected data structure
4. Verify the Redux store data transformation in PropertyDetailSlice.js

## Switching to Test Data

If you need to test with sample data instead of the database:

1. Edit the `test-property-database-fix.js` file
2. Change the `TEST_PROPERTY_ID` to a different ID or use a test ID
3. Run the test script again
