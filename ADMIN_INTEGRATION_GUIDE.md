# Admin Frontend Integration Guide

## Overview
The admin frontend has been successfully integrated into the user frontend with multi-tenancy routing.

## Structure

```
crazycars_frontend/
├── src/
│   ├── admin/                    # Admin-specific code
│   │   ├── components/           # Admin components (Dashboard, Products, Orders, etc.)
│   │   ├── store/                # Admin Redux store
│   │   ├── utils/                # Admin utilities
│   │   └── AdminApp.jsx          # Admin routing and layout
│   ├── components/               # Shared/User components
│   ├── pages/                    # User pages
│   ├── services/                 # Shared API services
│   └── App.jsx                   # Main app with routing
```

## Routing

### User Routes (No prefix)
- `/` - Home
- `/shop` - Shop page
- `/product/:id` - Product details
- `/cart` - Shopping cart
- `/login` - User login
- `/register` - User registration
- etc.

### Admin Routes (All under `/admin/*`)
- `/admin/signin` - Admin login
- `/admin/signup` - Admin registration
- `/admin/dashboard` - Admin dashboard
- `/admin/products` - Products management
- `/admin/products/add` - Add new product
- `/admin/products/:id` - Product details/edit
- `/admin/orders` - Orders management
- `/admin/orders/confirmed` - Confirmed orders
- `/admin/customers` - Customer management
- `/admin/categories/add` - Add category
- `/admin/companies/add` - Add company
- `/admin/settings` - Admin settings

## Key Features

### 1. **Multi-Tenancy Routing**
- Admin routes are completely isolated under `/admin/*`
- User routes remain at root level
- No conflicts between admin and user routes

### 2. **Protected Routes**
- Admin routes are protected with authentication check
- Redirects to `/admin/signin` if not authenticated
- Uses `localStorage.getItem('adminToken')` for auth check

### 3. **Separate State Management**
- Admin has its own Redux store
- User frontend has its own Redux store
- No state conflicts

### 4. **Shared Components**
- Common UI components can be shared
- API services are shared between admin and user
- Utilities can be shared

## Installation

### Install Missing Dependencies
```bash
npm install axios jspdf jspdf-autotable react-easy-crop react-spinners recharts lucide-react @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome
```

## Usage

### Accessing Admin Panel
1. Navigate to `http://localhost:5173/admin`
2. You'll be redirected to `/admin/signin`
3. After login, you'll access the admin dashboard

### Accessing User Frontend
1. Navigate to `http://localhost:5173/`
2. Normal user experience

## Authentication

### Admin Authentication
- Stored in `localStorage` with key `adminToken`
- Checked in `AdminApp.jsx` ProtectedRoute component
- Modify the auth logic in `AdminApp.jsx` as needed

### User Authentication
- Handled separately in user components
- No interference with admin auth

## Customization

### Updating Admin Routes
Edit `/src/admin/AdminApp.jsx` to add/modify admin routes

### Updating User Routes
Edit `/src/App.jsx` to add/modify user routes

### Sharing Components
Place shared components in `/src/components/` and import from both admin and user code

## API Integration

### Admin API Calls
- Admin components use the shared API service from `/src/services/api.js`
- Can create admin-specific API methods if needed

### User API Calls
- User components use the same shared API service
- Separate endpoints for admin and user operations

## Styling

### Admin Styling
- Admin uses Tailwind CSS (same as user frontend)
- Admin-specific styles can be added to admin components
- Dark mode support included

### User Styling
- Existing user styles remain unchanged
- Shared Tailwind configuration

## Development

### Running the App
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Testing Admin Routes
1. Start dev server
2. Navigate to `http://localhost:5173/admin/signin`
3. Test all admin functionality

### Testing User Routes
1. Navigate to `http://localhost:5173/`
2. Test all user functionality

## Troubleshooting

### Import Errors
- Check that all admin component imports use relative paths from their new location
- Admin components should import from `../` or `../../` as needed

### Routing Issues
- Ensure all admin routes are under `/admin/*`
- Check that AdminApp.jsx is properly imported in App.jsx

### State Management Issues
- Admin Redux store is separate from user store
- Each has its own Provider in their respective App components

### Authentication Issues
- Check localStorage for `adminToken`
- Verify ProtectedRoute logic in AdminApp.jsx
- Update auth logic based on your backend implementation

## Next Steps

1. **Update Admin Components**: Review and update import paths in admin components if needed
2. **Configure Authentication**: Implement proper admin authentication with your backend
3. **Test All Routes**: Thoroughly test both admin and user routes
4. **Customize Styling**: Adjust admin panel styling to match your brand
5. **Add Features**: Extend admin functionality as needed

## Migration Checklist

- [x] Copy admin components to `/src/admin/components/`
- [x] Copy admin store to `/src/admin/store/`
- [x] Copy admin utils to `/src/admin/utils/`
- [x] Create AdminApp.jsx with routing
- [x] Update main App.jsx with admin routes
- [x] Create integration documentation
- [ ] Install missing dependencies
- [ ] Test admin routes
- [ ] Test user routes
- [ ] Update authentication logic
- [ ] Test production build

## Support

For issues or questions, refer to:
- Main App.jsx for routing configuration
- AdminApp.jsx for admin-specific routing
- Individual component files for component-specific issues
