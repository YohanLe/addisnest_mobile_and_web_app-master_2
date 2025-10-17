# Partnership Requests Seed Data

This document explains how to use the seed data script for the `partnershiprequests` collection.

## Overview

The `partnershiprequests` collection is used to store partnership requests submitted from the Partner With Us page. Each request has a default status of "not revised" when initially submitted.

## Seed Data Script

The `seed-partnership-requests.js` script populates the `partnershiprequests` collection with sample data to help with testing and development.

### Sample Data Included

The seed script includes 7 sample partnership requests with the following types:
- Advertising partnerships
- Corporate partnerships
- Service partnerships

Each record includes:
- Company name
- Contact name
- Email
- Phone number
- Partnership type
- Message
- Status (default: "not revised")
- Creation and update timestamps

## How to Use

### Prerequisites

1. Make sure MongoDB is running
2. Ensure your `.env` file contains the `MONGO_URI` variable with the correct connection string
3. The `partnershiprequests` collection should already exist in your database

### Running the Seed Script

1. Run the batch file:
   ```
   seed-partnership-requests.bat
   ```

   Or run the script directly:
   ```
   node seed-partnership-requests.js
   ```

2. The script will:
   - Connect to your MongoDB database
   - Check if the `partnershiprequests` collection exists
   - Check if the collection already has data
   - Insert the sample partnership requests
   - Display a summary of the inserted records

### Force Option

If the collection already contains data and you still want to add the seed data, use the `--force` flag:

```
node seed-partnership-requests.js --force
```

## Data Structure

Each partnership request in the seed data follows this structure:

```javascript
{
  companyName: String,       // Name of the company requesting partnership
  contactName: String,       // Name of the contact person
  email: String,             // Email address for contact
  phone: String,             // Phone number
  partnershipType: String,   // Type of partnership (advertising, corporate, service, other)
  message: String,           // Partnership request message
  status: String,            // Status of the request (default: "not revised")
  createdAt: Date,           // Creation timestamp
  updatedAt: Date            // Last update timestamp
}
```

## Integration with the Application

The `partnershiprequests` collection is used by:

1. The Partner With Us page for submitting new partnership requests
2. The admin dashboard for managing and reviewing partnership requests

When a user submits a partnership request from the Partner With Us page, a new record is created in this collection with a default status of "not revised".

## Viewing the Data

You can view the seed data in your MongoDB database using:

1. MongoDB Compass
2. MongoDB Atlas (if using cloud database)
3. The mongo shell
4. The admin dashboard in the application (navigate to the Partnership Requests section)
