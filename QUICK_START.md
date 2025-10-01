# 🚀 Quick Start Guide

## Installation (One-Time Setup)

```bash
cd /Users/iamcaptain/Desktop/crazycars_frontend_user/crazycars_frontend

# Install admin dependencies
./install-admin-deps.sh

# Or manually:
npm install axios jspdf jspdf-autotable react-easy-crop react-spinners recharts lucide-react @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome
```

## Running the Application

```bash
npm run dev
```

## Access Points

| Application | URL | Description |
|------------|-----|-------------|
| **User Frontend** | http://localhost:5173/ | Main e-commerce site |
| **Admin Panel** | http://localhost:5173/admin | Admin dashboard |
| **Admin Login** | http://localhost:5173/admin/signin | Admin authentication |

## Key Routes

### 👤 User Routes (No prefix)
- `/` - Home
- `/shop` - Products
- `/product/:id` - Product details
- `/cart` - Shopping cart
- `/login` - User login

### 👨‍💼 Admin Routes (All under `/admin/*`)
- `/admin/signin` - Login
- `/admin/dashboard` - Dashboard
- `/admin/products` - Manage products
- `/admin/orders` - Manage orders
- `/admin/customers` - Manage customers

## File Structure

```
src/
├── admin/              # Admin code (NEW)
│   ├── components/     # Admin components
│   ├── store/          # Admin Redux
│   └── AdminApp.jsx    # Admin routing
├── components/         # User/Shared
├── pages/              # User pages
└── App.jsx             # Main routing (UPDATED)
```

## Quick Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Documentation

- `MERGE_SUMMARY.md` - Complete merge overview
- `ADMIN_INTEGRATION_GUIDE.md` - Detailed integration guide

## Status

✅ **Ready to use!**

Just run `npm run dev` and navigate to:
- http://localhost:5173/ (User)
- http://localhost:5173/admin (Admin)
