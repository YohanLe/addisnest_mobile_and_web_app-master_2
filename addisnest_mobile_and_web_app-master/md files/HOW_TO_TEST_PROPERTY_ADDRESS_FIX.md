# How to Test the Nested Address Structure Implementation

This guide provides step-by-step instructions for testing the new nested address structure implementation. The update ensures that both flat and nested address fields are supported for property submissions.

## Automated Testing

### Using the Test Script

1. Run the automated test script by double-clicking the `run-nested-address-test.bat` file or by executing:
   ```
   node test-nested-address.js
   ```

2. The test script will:
   - Create a test user (if not already present)
   - Create test properties with different address formats
   - Verify that both flat and nested address fields are correctly saved
   - Clean up the test data when complete

3. The output will show detailed information about each step and whether the tests passed or failed.

## Manual Testing

### Submitting a Property via the UI

1. Start the application:
   ```
   npm run dev
   ```

2. Log in to your account

3. Navigate to the property submission form (`/property-list-form`)

4. Fill out the property form with complete address information:
   - Enter a street name
   - Enter a city
   - Select a state/region
   - Select a country (Ethiopia is default)

5. Submit the form and proceed to the promotion selection page

6. Select a promotion plan (Basic/VIP/Diamond) and continue

7. If using the Basic plan, you'll be directed to your account dashboard
   If using a paid plan, you'll go through the payment process first

8. Check the property listing in your dashboard to verify it was created successfully

### Verifying the Data Structure

To verify that both flat and nested address structures are present in the database:

1. Use MongoDB Compass or another MongoDB client to connect to your database

2. Navigate to the `properties` collection

3. Find your recently added property

4. Verify that the document contains:
   - Flat address fields at the root level: `street`, `city`, `state`, `country`
   - Nested address structure under the `address` field with the same values

## Testing Different Scenarios

### Scenario 1: Complete Address Information

When providing complete address information, both flat and nested address structures should be created with the same values.

### Scenario 2: Partial Address Information

When providing only some address fields (e.g., only street and city), the system should:
- Save the provided fields in both flat and nested formats
- Use default values or empty strings for missing fields

### Scenario 3: Address in Nested Format Only

When the address is provided only in nested format (less common), the system should:
- Extract the values from the nested structure
- Apply them to the flat fields for backward compatibility

## Troubleshooting

### Common Issues

1. **Validation Errors**: If you encounter validation errors, check that all required fields (including address fields) have values.

2. **500 Internal Server Error**: This may indicate that the address format is not being properly handled. Check the server logs for details.

3. **Missing Address Fields**: If some address fields are missing in the database, verify that the controller is correctly synchronizing both address formats.

### Checking Logs

To diagnose issues, check the server logs:

```
npm run dev
```

Look for messages related to property creation and address formatting.

## Additional Notes

- The implementation maintains backward compatibility with existing code that expects flat address fields.
- The nested address structure follows best practices for MongoDB document design.
- All new property submissions will automatically include both address formats.
