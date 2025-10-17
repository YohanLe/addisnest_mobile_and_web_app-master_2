# How to Test the Property Duplication Fix

## Step 1: Navigate to Your Project Directory

Open a terminal/command prompt and navigate to your project folder:

```bash
cd "c:/Users/yohan/Desktop/final_addinest_Both mobile and web"
```

## Step 2: Start the Server

Run the server with the new logging:

```bash
node server-production.js
```

You should see output like:
```
=================================================
     AddisNest Production Server Starting           
=================================================
Environment: production
Port: 3000
Server running in production mode on port 3000
```

## Step 3: Test the Fix

1. **Open your browser** and go to `http://localhost:3000`
2. **Check the server terminal** for these debug logs:
   ```
   === PROPERTY QUERY DEBUG ===
   Request query params: {...}
   Properties found: 3
   Property IDs: [...]
   Offering types: [...]
   === END PROPERTY QUERY DEBUG ===
   ```

3. **Open browser developer tools** (F12) and check the console for:
   ```
   Fetching mixed properties...
   Total properties fetched: 3
   Property stats for before deduplication:
   - Total properties: 3
   Property stats for after deduplication:
   - Total properties: 3
   Unique properties after deduplication: 3
   ```

## Step 4: Verify the Fix

- **UI should now show**: Exactly 3 properties (matching your Atlas database)
- **Server logs should show**: 3 properties found
- **Browser logs should show**: 3 properties after deduplication

## Alternative: Use the Batch File

If you have trouble with the command, you can also use:

```bash
# If you have a batch file for starting the server
run-server-with-env.cjs
```

Or:

```bash
# Standard npm start (if configured in package.json)
npm start
```

## Troubleshooting

If you get errors:

1. **"node is not recognized"**: Install Node.js from nodejs.org
2. **"Cannot find module"**: Run `npm install` first
3. **Port already in use**: Stop any existing servers or use a different port

## What to Look For

After starting the server and visiting the homepage:

✅ **Success**: UI shows 3 properties (same as Atlas)
❌ **Still broken**: UI shows 6 properties (duplication still occurring)

If still broken, check the logs to see if the deduplication is working properly.
