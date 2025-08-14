# CCC Frontend Application

A React-based user authentication and profile management application built with modern web technologies.

## Features

### 1. Login Page
- Username and password fields
- Basic form validation
- API integration with proper headers
- Token-based authentication
- Redirect to profile page on success

### 2. Registration Page
- **Required Fields**: Username, First Name, Country, Phone Number, Email, Password
- **Optional Fields**: Last Name
- **Dynamic Features**:
  - Country dropdown with API integration
  - Auto-populated IDD codes based on country selection
  - Real-time form validation
- **API Integration**:
  - Fetch country list on page load
  - Fetch IDD codes when country is selected
  - Validate mobile number before submission
  - Validate email address before submission
  - Submit registration data with proper headers

### 3. Profile Page
- Display all user information
- Profile image upload functionality
- Protected route (requires authentication)
- Logout functionality

## API Endpoints

| API | Method | Endpoint | Purpose |
|-----|--------|----------|---------|
| API1 | POST | `/endpoints/ccc-hr-25-f/Login` | User authentication |
| API2 | GET | `/endpoints/common/GetCountryList` | Fetch country list |
| API3 | POST | `/endpoints/common/GetCountryIDDCode` | Get IDD code for country |
| API4 | POST | `/endpoints/common/ValidateMobileNumber` | Validate phone number |
| API5 | POST | `/endpoints/common/ValidateEmail` | Validate email address |
| API6 | POST | `/endpoints/ccc-hr-25-f/Register` | User registration |
| API7 | POST | `/endpoints/ccc-hr-25-f/GetProfile` | Fetch user profile |
| API8 | POST | `/endpoints/ccc-hr-25-f/UpdateProfileImage` | Update profile image |

## Technical Implementation

### Headers Added
All API calls now include the following headers:
- `Content-Type: application/json`
- `Accept: application/json`
- `Authorization: Bearer` (where applicable)
- `X-Requested-With: XMLHttpRequest`

### Error Handling
- Comprehensive error logging for debugging
- Fallback mechanisms for API failures
- User-friendly error messages
- Graceful degradation when APIs are unavailable

### Validation Flow
1. **Client-side validation**: Basic field requirements and format checks
2. **Mobile validation**: API call to validate phone number format
3. **Email validation**: API call to validate email address
4. **Registration submission**: Final API call with all validated data

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
cd app
npm install
```

### Development
```bash
npm run dev
```

The application will start on `http://localhost:5173`

### Build
```bash
npm run build
```

## Testing the Application

### 1. Test Registration Flow
1. Navigate to `/register`
2. Fill in all required fields
3. Select a country (IDD code should auto-populate)
4. Enter a valid phone number and email
5. Submit the form
6. Check browser console for API call logs

### 2. Test Login Flow
1. Navigate to `/login`
2. Use credentials from successful registration
3. Submit the form
4. Should redirect to profile page

### 3. Test Profile Page
1. Verify all user data is displayed
2. Test profile image upload
3. Test logout functionality

## Troubleshooting

### Common Issues

1. **"Required headers & parameters missing" error**
   - Solution: All required headers are now included in the code
   - Check browser console for detailed request/response logs

2. **API validation failures**
   - Check console logs for validation API responses
   - Verify phone number and email format

3. **Country list not loading**
   - Fallback countries are provided if API fails
   - Check network tab for API call status

### Debug Information
The application includes comprehensive logging:
- All API request data and headers
- API response status and data
- Error details with response codes
- Fallback mechanism usage

## Browser Console Logs

When testing, check the browser console for:
- API request details
- Response data
- Error messages
- Validation results
- Fallback mechanism usage

This will help identify any remaining API integration issues.
