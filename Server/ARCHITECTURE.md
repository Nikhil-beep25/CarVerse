# CarVerse Backend Architecture & Technical Guide (Phase 2)

## 1. Architectural Overview

The CarVerse backend is built using a modern, scalable, layered architectural pattern on top of **Node.js**, **Express.js**, and **MongoDB (Mongoose)**. It enforces strict separation of concerns, enterprise security, centralized error handling, and robust input validation.

```
                  +--------------------------------+
                  |         HTTP Request           |
                  +--------------------------------+
                                  |
                                  v
                  +--------------------------------+
                  |  Global Middleware Pipeline    |
                  |  - Helmet (Security Headers)   |
                  |  - CORS (Whitelist / Origin)   |
                  |  - Compression                 |
                  |  - Body Parsers & CookieParser |
                  |  - Morgan Logger               |
                  |  - Rate Limiter                |
                  +--------------------------------+
                                  |
                                  v
                  +--------------------------------+
                  |        API Router Layer        |
                  |  - /api/v1 (Modern Versioned)  |
                  |  - /api (Legacy Alias)         |
                  +--------------------------------+
                                  |
                                  v
                  +--------------------------------+
                  |   Route-Level Middleware       |
                  |  - protect (JWT Auth)          |
                  |  - authorize (RBAC Guard)      |
                  |  - validate (Zod Schema)       |
                  |  - uploadSingle / uploadFields |
                  +--------------------------------+
                                  |
                                  v
                  +--------------------------------+
                  |       Controllers (Thin)       |
                  |  - Request unwrapping          |
                  |  - Response formatting         |
                  +--------------------------------+
                                  |
                                  v
                  +--------------------------------+
                  |       Services (Business)      |
                  |  - Data transformation         |
                  |  - Database queries            |
                  |  - External integrations       |
                  +--------------------------------+
                                  |
                                  v
                  +--------------------------------+
                  |         Models (Mongoose)      |
                  |  - Schema definitions          |
                  |  - Virtuals, hooks, indices    |
                  +--------------------------------+
                                  |
                                  v
                  +--------------------------------+
                  |     MongoDB Database Engine    |
                  +--------------------------------+
```

---

## 2. Directory Structure & Responsibilities

```
Server/
├── .env                          # Local environment variables
├── app.js                        # Express application instance & global middleware setup
├── server.js                     # HTTP server listener, DB connection & process lifecycle
├── package.json                  # Dependencies, scripts, and project metadata
├── data.json                     # Seed dataset for cars, brands, and categories
├── public/                       # Static public assets (e.g., car/brand/category images)
├── ARCHITECTURE.md               # Backend architecture documentation
└── src/
    ├── config/                   # Configuration adapters
    │   ├── env.js                # Frozen & validated environment configuration
    │   ├── cors.js               # CORS origins, methods, and credentials options
    │   └── db.js                 # Database connection export adapter
    ├── constants/                # Immutable global constants
    │   ├── httpStatus.js         # HTTP status codes (200, 201, 400, 401, 403, 404, etc.)
    │   ├── roles.js              # RBAC role definitions (USER, ADMIN, MANAGER)
    │   └── responseMessages.js   # Standardized user-facing messages
    ├── controllers/              # Thin HTTP controllers handling req/res
    │   ├── auth.controller.js    # Authentication endpoints
    │   ├── brand.controller.js   # Brand CRUD endpoints
    │   ├── category.controller.js# Category CRUD endpoints
    │   ├── car.controller.js     # Car fleet CRUD & search endpoints
    │   └── booking.controller.js # Booking creation and verification endpoints
    ├── database/                 # Database connection & lifecycle management
    │   └── index.js              # Mongoose connection pooling, listeners, and disconnect
    ├── errors/                   # Centralized Error Hierarchy
    │   ├── AppError.js           # Base operational error class
    │   └── index.js              # Concrete subclasses (BadRequest, Unauthorized, etc.)
    ├── helpers/                  # Pure utility helper functions
    │   └── token.helper.js       # JWT generation, verification, and cookie handling
    ├── middleware/               # Express middleware functions
    │   ├── auth.middleware.js    # JWT authentication (`protect`) and RBAC (`authorize`)
    │   ├── error.middleware.js   # 404 not found handler & global error handler
    │   ├── logger.middleware.js  # Morgan HTTP request logger
    │   ├── rateLimiter.middleware.js # Express-rate-limit configurations
    │   ├── upload.middleware.js  # Multer disk storage and file filter middleware
    │   └── validate.middleware.js# Zod schema validation middleware
    ├── models/                   # Mongoose data models
    │   ├── User.js               # User schema with bcrypt pre-save password hash
    │   ├── Brand.js              # Brand schema with unique name indexes
    │   ├── Category.js           # Category schema with unique name indexes
    │   ├── Car.js                # Car schema with auto-calculated final rent & text indexes
    │   └── Booking.js            # Booking schema with status and availability indexes
    ├── routes/                   # Modular Express routers
    │   ├── index.js              # Root router mounting /v1 modules and health check
    │   ├── auth.routes.js        # /auth routes
    │   ├── brand.routes.js       # /brands routes
    │   ├── category.routes.js    # /categories routes
    │   ├── car.routes.js         # /cars routes
    │   └── booking.routes.js     # /bookings routes
    ├── services/                 # Reusable business logic & database queries
    │   ├── auth.service.js       # User registration, login, profile logic
    │   ├── brand.service.js      # Brand database operations
    │   ├── category.service.js   # Category database operations
    │   ├── car.service.js        # Car filtering, pagination, search, and CRUD
    │   └── booking.service.js    # Booking pricing and query operations
    ├── uploads/                  # Local folder for user-uploaded files
    │   └── .gitkeep              # Directory placeholder
    ├── utils/                    # Shared operational utilities
    │   ├── ApiResponse.js        # Standardized API response formatter
    │   ├── asyncHandler.js       # Eliminates try/catch boilerplate in controllers
    │   ├── createDefaultAdmin.js # Seeds initial Super Admin on boot if missing
    │   ├── logger.js             # Formatted, multi-level console logger
    │   └── seed.js               # Seeding script for CarVerse catalog
    └── validations/              # Zod input validation schemas
        ├── auth.validation.js    # Auth register, login, profile update schemas
        ├── brand.validation.js   # Brand create, update, and param schemas
        ├── category.validation.js# Category create, update, and param schemas
        ├── car.validation.js     # Car create, update, and param schemas
        └── booking.validation.js # Booking create, verify, and status schemas
```

---

## 3. Global Middleware Pipeline

Every HTTP request traverses the middleware pipeline in the following sequence:

| Step | Middleware | Purpose |
|------|------------|---------|
| **1** | `helmet` | Sets HTTP security headers (X-Frame-Options, Content-Security-Policy, etc.) with cross-origin resource policy enabled for images. |
| **2** | `cors` | Verifies origin against allowed whitelist (`CLIENT_URL`, `localhost:5173`, etc.) and allows credentials. |
| **3** | `compression` | Gzips/Deflates response payloads to minimize bandwidth and enhance performance. |
| **4** | `express.json` / `express.urlencoded` | Parses JSON and form data bodies with a 10MB limit. |
| **5** | `cookieParser` | Parses incoming Cookie headers and populates `req.cookies`. |
| **6** | `httpLogger` | Morgan logging in `dev` format for local dev and `combined` for production. |
| **7** | `express.static` | Serves static assets from `public/` and `src/uploads/`. |
| **8** | `globalRateLimiter` | Enforces a limit of 300 requests per 15 minutes per IP on `/api` routes. |
| **9** | `apiRouter` | Routes traffic to `/api/v1` and `/api` (backward compatibility). |
| **10** | `notFoundHandler` | Catches unmatched routes and creates a 404 `AppError`. |
| **11** | `errorHandler` | Centralized error handler returning consistent error JSON. |

---

## 4. Centralized Error Handling & Response Standards

### Standard Success Format
Every successful API response follows this exact structure:
```json
{
  "success": true,
  "message": "Cars fetched successfully",
  "data": [ ... ],
  "pagination": {
    "total": 12,
    "page": 1,
    "limit": 50,
    "pages": 1
  }
}
```

### Standard Error Format
Every failure or exception produces this standardized envelope:
```json
{
  "success": false,
  "message": "Request validation failed on submitted fields",
  "errors": [
    {
      "field": "body.email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

### Built-in Error Adapters
The global error handler (`src/middleware/error.middleware.js`) automatically converts common framework errors:
- **Mongoose `CastError`**: Converted to `400 Bad Request` with message *"Invalid format for identifier"*.
- **Mongoose `11000 Duplicate Key`**: Converted to `409 Conflict` stating which field value is duplicate.
- **Mongoose `ValidationError`**: Converted to `422 Unprocessable Entity` with a list of invalid fields.
- **Zod `ZodError`**: Converted to `422 Unprocessable Entity` with structured field paths and error messages.
- **JWT `JsonWebTokenError` / `TokenExpiredError`**: Converted to `401 Unauthorized`.
- **Multer `LIMIT_FILE_SIZE` / `LIMIT_UNEXPECTED_FILE`**: Converted to `400 Bad Request`.

---

## 5. Authentication & Authorization Flow

### JWT Authentication (`protect`)
1. Looks for Bearer token in the `Authorization: Bearer <token>` header or `req.cookies.token`.
2. Verifies the token using `jwt.verify` against `env.JWT_SECRET`.
3. Loads the user from MongoDB and attaches it to `req.user`.
4. If missing or invalid, throws an `UnauthorizedError` (401).

### Role-Based Access Control (`authorize(...roles)`)
- Guard function attached to admin/manager routes:
```javascript
router.post('/', protect, authorize('admin', 'manager'), validate(createCarSchema), carController.createCar);
```
- Compares `req.user.role` with allowed roles. Throws `ForbiddenError` (403) if insufficient permissions.

---

## 6. Request Validation (Zod)

Validation is performed before reaching controller methods:
```javascript
router.post(
  '/register',
  authRateLimiter,
  validate(registerSchema),
  authController.register
);
```
- Validates `req.body`, `req.query`, and `req.params`.
- Automatically strips invalid inputs and casts valid types (e.g. string to number).

---

## 7. Database Layer & Lifecycle Management

- Connection pooling with `maxPoolSize: 10`.
- Automatic retry on disconnection with event listeners for `error`, `disconnected`, and `reconnected`.
- Graceful shutdown integration in `server.js` ensuring `disconnectDB()` is called when receiving `SIGTERM` or `SIGINT`.

---

## 8. API Route Directory

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| **GET** | `/api/v1/health` | Public | Service health & uptime status |
| **POST** | `/api/v1/auth/register` | Public | Register new user account |
| **POST** | `/api/v1/auth/login` | Public | Login with email & password |
| **GET** | `/api/v1/auth/me` | Protected | Get current user profile |
| **PUT** | `/api/v1/auth/updateprofile` | Protected | Update current user profile |
| **PUT** | `/api/v1/auth/changepassword` | Protected | Change user password |
| **GET** | `/api/v1/auth/logout` | Protected | Clear authentication cookie |
| **GET** | `/api/v1/brands` | Public | List all car brands |
| **GET** | `/api/v1/brands/:id` | Public | Get single brand by ID |
| **POST** | `/api/v1/brands` | Admin | Create brand |
| **PUT** | `/api/v1/brands/:id` | Admin | Update brand |
| **DELETE** | `/api/v1/brands/:id` | Admin | Delete brand |
| **GET** | `/api/v1/categories` | Public | List all categories |
| **GET** | `/api/v1/categories/:id` | Public | Get single category by ID |
| **POST** | `/api/v1/categories` | Admin | Create category |
| **PUT** | `/api/v1/categories/:id` | Admin | Update category |
| **DELETE** | `/api/v1/categories/:id` | Admin | Delete category |
| **GET** | `/api/v1/cars` | Public | List cars (supports filter, sort, search, pagination) |
| **GET** | `/api/v1/cars/:id` | Public | Get single car details |
| **POST** | `/api/v1/cars` | Admin | Create new car |
| **PUT** | `/api/v1/cars/:id` | Admin | Update car details |
| **DELETE** | `/api/v1/cars/:id` | Admin | Delete car |
| **POST** | `/api/v1/bookings` | Protected | Create booking |
| **POST** | `/api/v1/bookings/verify` | Protected | Verify payment signature |
| **GET** | `/api/v1/bookings/mybookings` | Protected | Get user booking history |
| **GET** | `/api/v1/bookings` | Admin | Get all bookings |
| **PUT** | `/api/v1/bookings/:id` | Admin | Update booking status |
