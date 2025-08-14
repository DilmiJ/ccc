# CCC User Management System

A simple React application that directly calls external APIs for user management functionality.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup

1. **Navigate to the app directory**:
   ```bash
   cd app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:5173`

## 📋 Features

### 1. Login Page
- Username and password authentication
- Direct integration with external login API
- JWT token storage for session management

### 2. Registration Page
- Complete user registration form
- Dynamic country dropdown (25 countries including Sri Lanka)
- Automatic IDD code fetching
- Real-time email and mobile validation
- All required fields with validation

### 3. Profile Page
- Display user profile information
- Profile image upload functionality
- Secure logout capability

## 🔗 API Integration

The application integrates directly with these external APIs:

| API | Endpoint | Method | Purpose |
|-----|----------|--------|---------|
| 1 | `https://apis.mavicsoft.com/endpoints/ccc-hr-25-f/Login` | POST | User authentication |
| 2 | `https://apis.mavicsoft.com/endpoints/common/GetCountryList` | GET | Fetch country list |
| 3 | `https://apis.mavicsoft.com/endpoints/common/GetCountryIDDCode` | POST | Get country IDD code |
| 4 | `https://apis.mavicsoft.com/endpoints/common/ValidateMobileNumber` | POST | Validate mobile number |
| 5 | `https://apis.mavicsoft.com/endpoints/common/ValidateEmail` | POST | Validate email address |
| 6 | `https://apis.mavicsoft.com/endpoints/ccc-hr-25-f/Register` | POST | User registration |
| 7 | `https://apis.mavicsoft.com/endpoints/ccc-hr-25-f/GetProfile` | POST | Get user profile |
| 8 | `https://apis.mavicsoft.com/endpoints/ccc-hr-25-f/UpdateProfileImage` | POST | Update profile image |

## 🛠️ Technology Stack

- **React 19**: Latest React with hooks
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client for API calls
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and development server

## 📁 Project Structure

```
ccc/
├── app/                     # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx    # Login page
│   │   │   ├── Register.jsx # Registration page
│   │   │   └── Profile.jsx  # Profile page
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # App entry point
│   │   └── App.css          # Global styles
│   ├── package.json         # Frontend dependencies
│   └── README.md            # Frontend documentation
└── README.md                # This file
```

## 🎯 Key Features

- **No Backend Required**: All API calls go directly to external services
- **Real-time Validation**: Email and mobile number validation via external APIs
- **Dynamic Country Selection**: 25 countries with automatic IDD code fetching
- **Profile Image Upload**: Direct integration with external image upload API
- **JWT Authentication**: Secure token-based authentication
- **Responsive Design**: Mobile-friendly interface
- **Error Handling**: Graceful fallbacks for API failures

## 🔐 Authentication Flow

1. User enters credentials on login page
2. Frontend calls external login API directly
3. JWT token received and stored in localStorage
4. User redirected to profile page
5. Protected routes check for valid token
6. Token used for subsequent API calls

## 🚨 Error Handling

- Graceful fallbacks for API failures
- User-friendly error messages
- Loading states for better UX
- Network error handling
- Fallback validation when external APIs are unavailable

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to any static hosting service**:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3
   - Any static file server

## 📝 Notes

- No backend server required
- All data is managed by external APIs
- JWT tokens are stored in localStorage
- CORS must be enabled on external APIs
- Fallback validation for API failures
- Simple and lightweight application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 