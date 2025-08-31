# E-commerce Backend API

A robust e-commerce REST API built with Node.js, Express, TypeScript, and MongoDB. This API provides a complete solution for e-commerce operations including user management, product catalog, shopping cart, orders, payments, and more.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with httpOnly cookies, role-based access control
- **Product Management**: Complete CRUD operations for products with categories, brands, and attributes
- **Shopping Cart**: Server-side cart management with real-time updates
- **Order Management**: Complete order lifecycle with status tracking
- **Payment Integration**: Stripe and SSLCommerz payment gateways
- **File Upload**: Cloudinary and AWS S3 integration for image uploads
- **Search & Filtering**: Advanced product search with multiple filters and facets
- **Email Notifications**: Order confirmations and password reset emails
- **API Documentation**: Complete Swagger/OpenAPI documentation
- **Security**: Helmet, CORS, rate limiting, input validation, XSS protection
- **Logging**: Winston-based logging with file and console outputs
- **Testing**: Vitest for unit and integration testing

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with httpOnly cookies
- **Validation**: Zod schema validation
- **File Upload**: Cloudinary / AWS S3
- **Payments**: Stripe, SSLCommerz
- **Email**: Nodemailer
- **Caching**: Redis
- **Documentation**: Swagger/OpenAPI 3
- **Testing**: Vitest
- **Linting**: ESLint + Prettier

## 📁 Project Structure

```
src/
├── config/           # Configuration files
├── db/              # Database connection
├── middleware/      # Express middleware
├── modules/         # Feature modules
│   ├── auth/        # Authentication
│   ├── users/       # User management
│   ├── categories/  # Category management
│   ├── brands/      # Brand management
│   ├── products/    # Product management
│   ├── reviews/     # Product reviews
│   ├── carts/       # Shopping cart
│   ├── wishlist/    # User wishlist
│   ├── coupons/     # Discount coupons
│   ├── orders/      # Order management
│   ├── payments/    # Payment processing
│   └── uploads/     # File uploads
├── routes/          # API routes
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Redis (optional, for caching)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   CLIENT_ORIGIN=http://localhost:3000

   # Database
   MONGO_URI=mongodb://localhost:27017/ecommerce

   # JWT Configuration
   JWT_ACCESS_SECRET=your-access-secret-key-here
   JWT_REFRESH_SECRET=your-refresh-secret-key-here
   JWT_ACCESS_EXPIRES=15m
   JWT_REFRESH_EXPIRES=7d

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Stripe Configuration
   STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
   STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## 📚 API Documentation

Once the server is running, you can access the interactive API documentation at:

- **Swagger UI**: `http://localhost:5000/docs`
- **Health Check**: `http://localhost:5000/health`

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run type-check   # TypeScript type checking

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
```

## 🔐 Authentication

The API uses JWT-based authentication with httpOnly cookies for security. The authentication flow includes:

1. **Register**: Create a new user account
2. **Login**: Authenticate and receive access/refresh tokens
3. **Refresh**: Get new access token using refresh token
4. **Logout**: Clear tokens and session

### Protected Routes

Most routes require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <access-token>
```

Or use the httpOnly cookies that are automatically set during login.

## 🛍 Core Features

### Products
- Create, read, update, delete products
- Product categories and brands
- Product attributes and variants
- Image uploads
- Search and filtering
- Product reviews and ratings

### Shopping Cart
- Add/remove items
- Update quantities
- Cart persistence
- Price calculations

### Orders
- Create orders from cart
- Order status tracking
- Payment integration
- Order history

### Payments
- Stripe integration
- SSLCommerz integration
- Payment webhooks
- Order confirmation

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request throttling
- **Input Validation**: Zod schema validation
- **XSS Protection**: Cross-site scripting prevention
- **NoSQL Injection Protection**: MongoDB query sanitization
- **JWT Security**: Secure token handling

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `CLIENT_ORIGIN` | Frontend URL | `http://localhost:3000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/ecommerce` |
| `JWT_ACCESS_SECRET` | JWT access token secret | Required |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | Required |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Optional |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Optional |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Optional |
| `STRIPE_SECRET_KEY` | Stripe secret key | Optional |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Optional |

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test -- --coverage
```

## 📦 Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set environment variables**
   ```bash
   NODE_ENV=production
   ```

3. **Start the server**
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the API documentation at `/docs`
- Review the health check endpoint at `/health`
