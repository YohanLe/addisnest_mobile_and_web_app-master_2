# MongoDB Migration to Atlas for Netlify Deployment

Based on the MongoDB Compass interface you shared, here's how to export your data from your local MongoDB and import it to Atlas:

## Step 1: Export Collections from MongoDB Compass

1. In MongoDB Compass, click on the `addisnest` database in the left sidebar
2. You'll see a list of collections in the main area
3. For each collection you want to export:
   - Click on the collection name
   - At the top right, click on the "Export Collection" button (three vertical dots menu → Export Data)
   - Choose JSON format
   - Select a location to save the file

## Step 2: Import Collections to MongoDB Atlas

1. In MongoDB Atlas, click "Connect" button on your Cluster1
2. Select "MongoDB Compass" from the connection options
3. Copy the connection string (it will look like `mongodb+srv://username:password@cluster1.xxxxx.mongodb.net/`)
4. Open MongoDB Compass and use the connection string to connect to your Atlas cluster
5. Create a new database named `addisnest` if it doesn't exist
6. For each collection JSON file you exported:
   - Click on the collection where you want to import data (or create a new collection)
   - Click "Add Data" → "Import File"
   - Select your JSON file
   - Select JSON format
   - Click "Import"

## Step 3: Update the Netlify Environment Variables

Once your data is migrated to Atlas, update your Netlify environment variable:

```
MONGO_URI=mongodb+srv://username:password@cluster1.xxxxx.mongodb.net/addisnest
```

Remember to replace:
- `username` with your Atlas username
- `password` with your Atlas password
- `cluster1.xxxxx.mongodb.net` with your actual cluster address

## Step 4: Test the Connection

After updating the environment variables in Netlify, redeploy your application and test the login functionality.
