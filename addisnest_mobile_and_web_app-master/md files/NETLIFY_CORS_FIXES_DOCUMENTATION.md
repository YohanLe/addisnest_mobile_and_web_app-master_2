# CORS Fixes for Netlify Deploy Previews

## Problem

The application was experiencing CORS (Cross-Origin Resource Sharing) policy errors when trying to fetch data from API endpoints. This was particularly problematic in Netlify deploy previews, which use different subdomains (like `685251fd33ae8b811b577985--addisnesttest.netlify.app`) than the main production site.

The error message was:
```
Access to XMLHttpRequest at 'https://addisnesttest.netlify.app/properties?...' from origin 'https://685251fd33ae8b811b577985--addisnesttest.netlify.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Solution

We implemented enhanced CORS configurations in all Netlify function files to ensure proper access across different environments:

### 1. Functions Enhanced with CORS Fixes:

- `functions/properties.js`
- `functions/getListings.js`
- `functions/api.js`

### 2. Key Changes:

#### Comprehensive CORS Configuration:
```javascript
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    // Allow any subdomain of netlify.app
    if (origin.endsWith('netlify.app') || origin.includes('--addisnesttest.netlify.app')) {
      return callback(null, true);
    }
    
    // Allow localhost for development
    if (origin.match(/^https?:\/\/localhost(:\d+)?$/)) {
      return callback(null, true);
    }
    
    // Production domain
    if (origin === 'https://addisnesttest.netlify.app') {
      return callback(null, true);
    }
    
    callback(null, true); // Temporarily allow all origins while debugging
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

#### Additional CORS Headers:
```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});
```

#### Enhanced Function Response Headers:
```javascript
return {
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  },
  body: JSON.stringify({
    // Response data here
  })
};
```

## Deployment

To deploy these changes:

1. Run the `deploy-cors-fixes.bat` script which will:
   - Commit the changes to Git
   - Deploy the changes to Netlify

## Testing

After deployment, verify that:

1. The main site can fetch property data without CORS errors
2. Deploy previews can fetch property data without CORS errors
3. Localhost development environment can fetch property data without CORS errors

## Notes for Future Development

- The current configuration allows all origins (`*`) for CORS as a temporary measure while debugging. For production environments, consider restricting this to only the necessary domains.
- The configuration specifically handles Netlify deploy previews by allowing any subdomain of `netlify.app`.
- If you add new Netlify functions in the future, be sure to apply the same CORS configuration to ensure consistent behavior.
