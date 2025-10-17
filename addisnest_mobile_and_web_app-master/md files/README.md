# Addinest Real Estate Platform

A comprehensive real estate platform for property listings, management, and transactions. This application allows users to list properties, search for properties, and manage their property portfolio.

## Features

- User authentication and account management
- Property submission with detailed information
- Multiple promotion plans (Basic, VIP, Diamond)
- Payment processing for premium listings
- Property search and filtering
- Image upload and management
- Responsive design for all devices

## Technology Stack

- **Frontend**: React.js, Redux
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT
- **Payment Processing**: Integration with local payment providers
- **File Storage**: Local storage with configurable options

## Recent Fixes & Improvements

This repository includes several important fixes:

1. **Nested Address Structure** - Improved address data handling with both flat and nested structures
2. **MongoDB ID Property Edit Fix** - Resolved issues with property editing using MongoDB ObjectIDs
3. **Image Format Handling** - Enhanced support for various image formats and improved upload process
4. **Property Submission Flow** - Fixed 500 errors during property submission process

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (local or remote connection)
- NPM or Yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/addinest-real-estate.git
   cd addinest-real-estate
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables by copying `.env.example` to `.env`
   ```
   cp .env.example .env
   ```

4. Edit the `.env` file with your database connection details and other configurations

5. Start the development server
   ```
   npm run dev
   ```

### Testing

Several test scripts are included:

- `run-nested-address-test.bat` - Test the nested address structure implementation
- `run-mongodb-id-test.bat` - Test the MongoDB ID property edit fix
- `run-image-format-fix-test.bat` - Test the image format handling
- `run-property-submission-500-fix-test.bat` - Test the property submission flow fix

## Special Starting Scripts

The project includes several scripts to start the application with specific fixes enabled:

- `start-app.bat` - Start the application normally
- `start-app-with-address-fix.bat` - Start with nested address structure fix
- `start-app-with-edit-fix.bat` - Start with MongoDB ID property edit fix
- `start-app-with-property-test.bat` - Start with property submission flow fix

## Documentation

Detailed documentation for each fix and feature:

- [Nested Address Structure Implementation](NESTED_ADDRESS_STRUCTURE_IMPLEMENTATION.md)
- [How to Test Property Address Fix](HOW_TO_TEST_PROPERTY_ADDRESS_FIX.md)
- [Property Address Fixes Applied](PROPERTY_ADDRESS_FIXES_APPLIED.md)
- [MongoDB ID Property Edit Fix](MONGODB_ID_PROPERTY_EDIT_FIX.md)
- [MongoDB ID Property Edit Fix Documentation](MONGODB_ID_PROPERTY_EDIT_FIX_DOCUMENTATION.md)
- [How to Run Property Edit Test](HOW_TO_RUN_PROPERTY_EDIT_TEST.md)
- [How to Test Image Format Fix](HOW_TO_TEST_IMAGE_FORMAT_FIX.md)
- [Image Handling Fix](IMAGE_HANDLING_FIX.md)
- [How to Test Property Submission Fix](HOW_TO_TEST_PROPERTY_SUBMISSION_FIX.md)
- [Property Submission Fixes Applied](PROPERTY_SUBMISSION_FIXES_APPLIED.md)

## Project Structure

```
.
├── src/                    # Source files
│   ├── Apis/               # API integration
│   ├── assets/             # Static assets
│   ├── components/         # React components
│   ├── config/             # Configuration files
│   ├── controllers/        # Express controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main React component
│   ├── main.jsx            # React entry point
│   └── server.js           # Express server
├── uploads/                # Uploaded files directory
├── public/                 # Public assets
├── .env                    # Environment variables
├── package.json            # Project dependencies
└── README.md               # Project documentation
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- All contributors who have helped improve this platform
- The open source community for providing valuable tools and frameworks
