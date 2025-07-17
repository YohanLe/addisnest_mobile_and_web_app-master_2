# How to Run the Property Edit Test

## Running the Test Script

### On Windows:

1. **Double-click Method:**
   - Open Windows Explorer and navigate to the project folder at: `c:/Users/yohan/Desktop/final_addinest_code`
   - Find the file named `start-property-edit-test.bat`
   - Double-click on it to run the batch file

2. **Command Prompt Method:**
   - Open Command Prompt (you can search for "cmd" in the Windows search bar)
   - Navigate to the project folder by typing:
     ```
     cd c:\Users\yohan\Desktop\final_addinest_code
     ```
   - Run the batch file by typing:
     ```
     start-property-edit-test.bat
     ```

## What the Test Script Does

The `start-property-edit-test.bat` script will:

1. Start the backend server (Node.js server)
2. Wait 5 seconds for the server to initialize
3. Start the frontend development server (Vite)
4. Wait 8 seconds for the frontend to initialize
5. Open the test page in your default browser at: http://localhost:5173/test-property-edit.html

## Testing Steps

Once the test page opens in your browser:

1. Click the "Run Test" button on the test page
2. This will simulate clicking the Edit button on a property listing by:
   - Creating sample property data
   - Storing it in localStorage
   - Setting the `force_property_edit` flag

3. Click the "Go to Edit Form" button that appears after running the test
4. This will navigate you to the property edit form page
5. Verify that the form is populated with the test property data
6. Make some changes to the form fields
7. Click "Update Property" to save your changes
8. The system will attempt to update the database, and you'll be redirected to the property listings page

## Troubleshooting

If you encounter any issues:

- Make sure both the backend and frontend servers started correctly
- Check the browser console for any error messages (press F12 to open developer tools)
- Verify that all required environment variables are set in the .env file
- Ensure that the database connection is properly configured

If any of the servers fail to start:

1. Close all terminal windows
2. Run each server separately to identify where the issue might be:
   - For backend: `node src/server.js`
   - For frontend: `cd src && npm run dev`
