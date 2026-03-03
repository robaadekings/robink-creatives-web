# Robink Creatives - Full Stack Application

A professional full-stack web application built with Node.js/Express, MongoDB, and React. This application includes a complete client portal, admin dashboard, and public-facing website.

## 🎯 Features

### Public Website
- **Landing Page**: Hero section with statistics, services, testimonials, and CTA
- **Portfolio**: Showcase of completed projects with filtering
- **Services**: Display of service offerings with categories
- **Contact**: Contact form with email integration
- **Navigation**: Smooth navigation with scroll progress indicator

### Client Portal
- **Dashboard**: View project stats, pending invoices, and quick actions
- **Projects**: List and manage assigned projects with progress tracking
- **Invoices**: View and download invoices with status tracking
- **Files**: Access deliverables and project assets
- **Messages**: Project-specific messaging system
- **Secure Access**: Role-based authentication and authorization

### Admin Dashboard
- **Dashboard**: Revenue analytics, pending items, and activity overview
- **Clients**: Manage clients with details and contact information
- **Projects**: View all projects with filtering and status updates
- **Invoices**: Manage invoices with inline status editing
- **Quotes**: Track quotes through their workflow
- **Settings**: Company information management
- **Notifications**: Real-time notifications for activities

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 16+
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB 7.0+ with Mongoose 9.1.6
- **Authentication**: JWT (7-day expiry)
- **File Storage**: Cloudinary
- **Email**: Resend
- **Security**: Helmet, CORS, rate limiting, bcrypt password hashing
- **PDF Generation**: PDFKit
- **Validation**: Joi

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.3.1
- **Styling**: TailwindCSS 4.2.0
- **Router**: React Router 7.13.0
- **State Management**: React Context API
- **HTTP Client**: Axios with interceptors
- **Animations**: Framer Motion 12.34.3
- **UI Components**: Shadcn/ui with Radix UI
- **Icons**: Lucide React
- **Forms**: React Hook Form 7.71.1 + Zod validation
- **Charts**: Recharts 3.7.0

## 📋 Project Structure

```
robink-creatives-web/
├── backend/
│   ├── config/              # Database and configuration files
│   ├── controllers/         # Business logic for each route
│   ├── middlewares/         # Auth, validation, error handling
│   ├── models/              # MongoDB schema definitions
│   ├── routes/              # API route definitions
│   ├── services/            # Email, notifications, etc.
│   ├── utils/               # Helper functions, JWT, mailer
│   ├── validators/          # Input validation schemas
│   ├── app.js               # Express app configuration
│   ├── server.js            # Server entry point
│   ├── package.json         # Dependencies
│   └── .env.example         # Environment template
│
└── frontend/
    ├── src/
    │   ├── app/             # Authentication provider
    │   ├── assets/          # Images and media
    │   ├── components/      # Reusable UI components
    │   ├── context/         # Auth context provider
    │   ├── layouts/         # Page layouts (Admin, Client, Public)
    │   ├── lib/             # Utility functions
    │   ├── pages/           # Page components
    │   │   ├── admin/       # Admin pages
    │   │   ├── client/      # Client portal pages
    │   │   └── public/      # Landing, Services, Portfolio, etc.
    │   ├── routes/          # Route configuration
    │   ├── utils/           # Axios config, helpers
    │   ├── main.jsx         # App entry point
    │   └── index.css        # Global styles
    ├── public/              # Static assets
    ├── package.json         # Dependencies
    ├── vite.config.js       # Vite configuration
    └── .env.example         # Environment template
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js 16+ and npm/pnpm
- MongoDB account (Atlas recommended)
- Cloudinary account (free tier available)
- Resend API key (for emails)

### Backend Setup

1. **Clone and install dependencies**
   ```bash
   cd backend
   pnpm install
   ```

2. **Create `.env` file** (copy from `.env.example`)
   ```bash
   cp .env.example .env
   ```

3. **Update environment variables**
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Generate a random secret key
   - `RESEND_API_KEY`: Your Resend API key
   - `CLOUDINARY_*`: Your Cloudinary credentials

4. **Start the development server**
   ```bash
   pnpm dev
   ```

The backend will run on `http://localhost:5000/api`

### Frontend Setup

1. **Clone and install dependencies**
   ```bash
   cd frontend
   pnpm install
   ```

2. **Create `.env` file** (copy from `.env.example`)
   ```bash
   cp .env.example .env
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

The frontend will run on `http://localhost:5173`

## 📱 User Roles & Access

### Roles
- **Superadmin**: Full control over all features
- **Admin**: Manage clients, projects, invoices, quotes
- **Manager**: Similar to Admin (for future expansion)
- **Client**: View own projects, invoices, files, and messages

### Access Control
- Role-based routing with `ProtectedRoute` and `RoleRoute`
- Token-based authentication with JWT
- Automatic redirect to login if unauthorized
- 401 errors trigger logout and redirect to login page

## 🔐 Authentication Flow

### Registration
1. User fills registration form (name, email, password)
2. Password is hashed with bcrypt
3. User document created in MongoDB
4. JWT token returned immediately
5. User auto-redirected to dashboard

### Login
1. User submits email and password
2. Password verified against hash
3. JWT token generated (7-day expiry)
4. Token stored in localStorage
5. User redirected based on role (admin → admin dashboard, client → client dashboard)

### Password Reset
1. User clicks "Forgot Password"
2. Requests reset token with email
3. Email sent with reset token
4. User enters new password with token
5. Password updated in database
6. User redirected to login

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Client Routes
- `GET /api/client/dashboard` - Dashboard stats
- `GET /api/client/projects` - List client projects
- `GET /api/client/projects/:id` - Project details
- `GET /api/client/invoices` - List invoices
- `GET /api/client/invoices/:id` - Invoice details
- `GET /api/client/invoices/:id/pdf` - Download PDF
- `GET /api/client/quotes` - List quotes
- `GET /api/client/files` - Project assets/deliverables
- `GET /api/client/projects/:projectId/messages` - Get project messages
- `POST /api/client/projects/:projectId/messages` - Send message

### Admin Routes
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/clients` - List all clients
- `GET /api/admin/clients/:id` - Client details
- `GET /api/admin/projects` - List projects
- `PATCH /api/admin/projects/:id/status` - Update project status
- `GET /api/admin/invoices` - List invoices
- `PATCH /api/admin/invoices/:id/status` - Update invoice status
- `GET /api/admin/quotes` - List quotes
- `PATCH /api/admin/quotes/:id/status` - Update quote status
- `GET /api/admin/notifications` - Get notifications
- `PATCH /api/users/:id/promote` - Promote user to admin

### Public Routes
- `GET /api/services` - List services
- `GET /api/service-categories` - List service categories
- `GET /api/portfolios` - List portfolio items
- `POST /api/contact` - Submit contact form

## 🎨 UI/UX Features

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Dark Theme**: Professional dark mode throughout
- **Loading States**: Loader2 spinners on all async operations
- **Error Handling**: Global error boundary + component-level error display
- **Smooth Transitions**: Framer Motion animations and page transitions
- **Gradient Styling**: Modern gradient backgrounds and buttons
- **Icons**: Consistent Lucide icon usage throughout
- **Color Scheme**:
  - Primary: Red (#EF4444)
  - Secondary: Yellow (#FBBF24)
  - Dark Background: #0f172a, #111827
  - Text: White, Gray-400, Gray-500

## 🧪 Testing Workflow

### To test the full application:

1. **Register a new client**
   - Visit `http://localhost:5173/portal/register`
   - Fill in credentials
   - Should auto-login to dashboard

2. **Admin login**
   - Register with admin role or use seed script
   - Login at `http://localhost:5173/portal/login`
   - Should redirect to `/admin/dashboard`

3. **Client workflow**
   - Access dashboard (stats cards)
   - View projects (grid with progress)
   - Check invoices (table with status)
   - Download files
   - Send project messages

4. **Admin workflow**
   - View dashboard analytics
   - Manage clients list
   - Update project statuses
   - Edit invoice statuses
   - View quotes and quotes
   - Manage notifications

5. **Public pages**
   - Landing page with stats and testimonials
   - Services page with all offerings
   - Portfolio page with filtering
   - Contact form submission

## 📧 Email Integration

Emails are sent using Resend for:
- User registration confirmation
- Password reset requests
- Invoice notifications
- Message notifications

Configure in `.env`:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx
```

## 🖼️ File Management

Files are stored on Cloudinary with:
- Automatic optimization
- CDN delivery
- Secure URLs
- Automatic cleanup of old files

Configure in `.env`:
```env
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
RESEND_API_KEY=re_...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
PORT=5000
NODE_ENV=development
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

## 📈 Performance Optimizations

- Code splitting with React Router
- Image lazy loading
- Memoized components with React.memo
- Debounced API calls
- CDN-delivered assets via Cloudinary
- Optimized bundle size with tree-shaking
- MongoDB indexing on frequently queried fields

## 🐛 Error Handling

- **Global Error Boundary**: Catches React component errors
- **API Error Interceptor**: Handles 401 status and redirects to login
- **Form Validation**: Joi on backend, React Hook Form + Zod on frontend
- **User-friendly Messages**: Error messages displayed in UI, not technical errors

## 📱 Responsive Breakpoints

- **Mobile**: Default (< 768px)
- **Tablet**: `md:` (≥ 768px)
- **Desktop**: `lg:` (≥ 1024px)

## 🚀 Deployment

### Backend (Vercel/Render/Heroku)
1. Set environment variables in platform
2. Connect repository
3. Set build command: `npm install` (or `pnpm install`)
4. Set start command: `node server.js`

### Frontend (Vercel/Netlify)
1. Set `VITE_API_URL` to production backend URL
2. Connect repository
3. Build command: `pnpm build`
4. Output directory: `dist`

## 📝 Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (superadmin/admin/manager/client),
  company: String,
  phone: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Project
```javascript
{
  title: String,
  description: String,
  client: ObjectId (User),
  status: String (active/completed/on-hold),
  budget: Number,
  progress: Number (0-100),
  deadline: Date,
  assets: [{ url, name, type }],
  createdAt: Date,
  updatedAt: Date
}
```

### Invoice
```javascript
{
  invoiceNumber: String (unique),
  project: ObjectId (Project),
  client: ObjectId (User),
  total: Number,
  currency: String,
  status: String (pending/paid/overdue),
  dueDate: Date,
  items: [{ description, quantity, rate }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 📞 Support

For issues or questions, contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Production Ready ✅
