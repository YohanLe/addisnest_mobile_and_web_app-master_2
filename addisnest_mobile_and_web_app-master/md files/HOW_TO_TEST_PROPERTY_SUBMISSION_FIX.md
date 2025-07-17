# How to Test the Property Submission Fix

This guide provides step-by-step instructions to test the fix for the 500 Internal Server Error that was occurring when submitting properties through the Choose Promotion page.

## Prerequisites

- Ensure the AddiNest application is running with the latest code changes
- Have access to a test user account

## Test Steps

### 1. Start the Application with Fix

Run the application with the fix enabled:

```bash
# Windows
run-property-submission-500-fix-test.bat

# Unix/Linux/Mac
node src/fix-property-submission.js
```

### 2. Complete Property Listing Form

1. Navigate to `/property-list-form`
2. Fill out the property details form with test data:
   - Property Type: Apartment
   - Property For: For Sale
   - Property Address: Test Street Address
   - City: Test City
   - Regional State: Addis Ababa City Administration
   - Price: 1000000
   - Upload at least one test image
   - Fill out other required fields

3. Click "Continue" to proceed to the Choose Promotion page

### 3. Choose Promotion Plan

1. On the Choose Promotion page, select a promotion plan:
   - Basic Plan (free)
   - VIP Plan (paid)
   - Diamond Plan (paid)

2. Observe that the plan selection works correctly and the price updates accordingly

### 4. Test Submission - Basic Plan

1. Select the "Basic Plan"
2. Click the "Continue" button
3. Verify:
   - No 500 error occurs
   - You are redirected to the Account Management page
   - The property appears in your property listings

### 5. Test Submission - Premium Plans

1. Return to the Choose Promotion page
2. Select either "VIP Plan" or "Diamond Plan"
3. Click the "Make Payment" button
4. Verify:
   - No 500 error occurs
   - You are redirected to the Payment Process page
   - The property and plan details are correctly passed to the payment page

### 6. Test with Edge Cases

1. **Test Mode**: 
   - Enable "Test Mode" at the bottom of the Choose Promotion page
   - Verify mock data is used instead of your real property data
   - Submission should complete without errors

2. **Missing Images**:
   - Create a property without uploading any images
   - Verify that default images are applied automatically
   - Submission should complete without errors

## Verification

After testing, check the following to confirm the fix is working properly:

1. The property has been saved to the database with the correct promotion type
2. No 500 errors occur during any part of the submission process
3. The property details are displayed correctly in the property listings

## Troubleshooting

If you encounter any issues during testing:

1. Check browser console logs for any JavaScript errors
2. Check server logs for any backend errors
3. Verify the property data being sent in the Network tab of browser dev tools
4. Ensure all required fields are properly filled out

## Reporting Issues

If you encounter any issues during testing, please report them with the following information:

1. Which test step failed
2. Error message (if any)
3. Browser console logs
4. Screenshots of the error or unexpected behavior
