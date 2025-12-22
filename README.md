# ⚙️ Turf Booking Management SaaS – Backend (MVP V1)

This backend powers the Turf Booking Management SaaS platform. It provides secure APIs for multi-role authentication, turf management, booking workflows, payments, and administrative actions.

## The system is built with scalability and clean architecture in mind, using Express.js, TypeScript, Prisma ORM, and PostgreSQL.

## 🌐 Live Frontend

**Frontend (Live):** [https://turf-frontend-deploy.vercel.app/](https://turf-frontend-deploy.vercel.app/)  
**Frontend Repository:** [https://github.com/imran-khan-dev/turf-frontend-deploy](https://github.com/imran-khan-dev/turf-frontend-deploy)

---

## 🚀 Core Features

### 🔐 Authentication & Authorization

- **JWT-based authentication** for secure access.
- **HTTP-only cookies** for storing access tokens safely.
- **Password hashing** with bcrypt.
- **Passport.js local strategy** for credential-based login.
- **Seeded Admin User** automatically created in database for initial login.
- **Role-based access control**

### 🖼️ File Uploads

- **Multer** for handling file uploads.
- **Cloudinary** integration for image hosting.

### ⚙️ Error Handling

- Centralized **global error handler** for consistent API responses.
- **Custom API error classes** for validation, authentication, and permission errors.
- **Prisma-specific error handling** for database constraint or relation issues.
- Graceful handling of server and unexpected runtime errors.

### 🧩 Architecture & Structure

- **Clean Modular Structure**:
  - `modules/` for feature-based logic
  - `middlewares/` for reusable middleware functions
  - `utils/` for helpers (token generation, file handling)
  - `errors/` for global error classes
  - `config/` for environment setup (Cloudinary, DB, etc.)

### 🧰 Tech Stack

- **Node.js + Express.js**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **Passport.js + JWT + bcrypt**
- **Multer + Cloudinary**
- **Cookie Parser**
- **Dotenv** for environment config

---

## Key Highlights

✅ Type-safe backend with TypeScript
✅ Modular folder structure
✅ JWT + Cookie-based authentication
✅ Global error + Prisma error handler
✅ Cloudinary image upload
✅ Seeded admin for immediate login
✅ Clean & maintainable architecture
