# ⚙️ Portfolio Website Backend (Express + Prisma + TypeScript)

A secure, modular, and scalable **backend API** built with **Express.js**, **TypeScript**, and **Prisma ORM** for the personal portfolio website.  
This API powers all features of the frontend, including authentication, blog management, and project portfolio management, while maintaining clean architecture and robust error handling.

---

## 🌐 Live Frontend

**Frontend (Live):** [https://b07-frontend3.vercel.app/](https://b07-frontend3.vercel.app/)  
**Frontend Repository:** [https://github.com/imran-khan-dev/B07-frontend](https://github.com/imran-khan-dev/B07-frontend)

---

## 🧠 Project Overview

This backend serves as the **content management and authentication system** for the personal portfolio.  
It allows the portfolio owner (admin) to securely log in and manage blogs and project content through the dashboard.

Built following **Clean Architecture & Modular Design**, the codebase separates controllers, routes, middlewares, services, and utility layers for maximum maintainability and scalability.

---

## 🚀 Core Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** for secure access.
- **HTTP-only cookies** for storing access tokens safely.
- **Password hashing** with bcrypt.
- **Passport.js local strategy** for credential-based login.
- **Seeded Admin User** automatically created in database for initial login.
- **Role-based access control** (only admin can access CRUD operations).

### 🧱 Blog Management
- Full CRUD for blog posts:
  - Create, read, update, delete.
- Supports:
  - Title, content, thumbnail, tags, views counter.
- Integrated **view counter** increments on each blog view request.

### 💼 Project Management (Portfolio)
- CRUD APIs for managing portfolio projects.
- Each project includes:
  - Title, description, features, live link, GitHub link, and image.

### 🖼️ File Uploads
- **Multer** for handling file uploads.
- **Cloudinary** integration for image hosting (blog thumbnails & project images).

### ⚙️ Error Handling
- Centralized **global error handler** for consistent API responses.
- **Custom API error classes** for validation, authentication, and permission errors.
- **Prisma-specific error handling** for database constraint or relation issues.
- Graceful handling of server and unexpected runtime errors.

### 🧩 Architecture & Structure
- **Clean Modular Structure**:
  - `modules/` for feature-based logic (blog, project, auth, user)
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

## 🧱 Folder Structure

src/
┣ app/
┃ ┣ modules/
┃ ┃ ┣ auth/
┃ ┃ ┣ blog/
┃ ┃ ┣ project/
┃ ┃ ┗ user/
┃ ┣ middlewares/
┃ ┣ errors/
┃ ┣ utils/
┃ ┗ config/
┣ app.ts
┗ index.ts


---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/imran-khan-dev/B07-backend.git
cd B07-backend

### Install dependencies
npm install

### Setup environment variables
Create a .env file in the root:
DB_URL="postgresql://<username>:<password>@<host>:<port>/<db-name>?schema=public"

NODE_ENV =development

JWT_ACCESS_SECRET=access_secret
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=JWT_REFRESH_SECRET
JWT_REFRESH_EXPIRES=30d

BCRYPT_SALT_ROUND=

ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_PHONE=

EXPRESS_SESSION_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

FRONTEND_URL=

## Prisma setup
npx prisma migrate deploy
npx prisma db seed

## Run the development server
npm run dev

## The API will be live at:
http://localhost:5000/


## Key Highlights

✅ Type-safe backend with TypeScript
✅ Modular folder structure
✅ JWT + Cookie-based authentication
✅ Global error + Prisma error handler
✅ Cloudinary image upload
✅ Seeded admin for immediate login
✅ CRUD for Blog & Portfolio Projects
✅ Clean & maintainable architecture

## Submission Summary

| Requirement                    | Status |
| ------------------------------ | ------ |
| Clean Modular Structure        | ✅      |
| JWT + Cookie Authentication    | ✅      |
| Blog Management APIs           | ✅      |
| Project Management APIs        | ✅      |
| Prisma ORM + PostgreSQL        | ✅      |
| Multer + Cloudinary            | ✅      |
| Global & Prisma Error Handling | ✅      |
| Seeded Admin                   | ✅      |
| TypeScript                     | ✅      |
| Live Integration with Frontend | ✅      |


## Postman API Json

{
	"info": {
		"_postman_id": "7ec45932-dd44-4fe2-945c-20fe756d8f49",
		"name": "Portfolio API",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
		"_exporter_id": "46052809",
		"_collection_link": "https://imran-9387812.postman.co/workspace/Imran's-Workspace~5b1842bb-c90d-49fd-85c3-73544419825d/collection/46052809-7ec45932-dd44-4fe2-945c-20fe756d8f49?action=share&source=collection_link&creator=46052809"
	},
	"item": [
		{
			"name": "User",
			"item": [
				{
					"name": "User by Id",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiaW1yYW5raGFuQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc1OTU5MjgxMCwiZXhwIjoxNzU5Njc5MjEwfQ.8hk1PBYLm_F84djNc261UwGwVEH8vskkhVEb_afvDsw",
								"type": "text"
							}
						],
						"url": {
							"raw": "{{URL}}/user/6",
							"host": [
								"{{URL}}"
							],
							"path": [
								"user",
								"6"
							]
						}
					},
					"response": []
				},
				{
					"name": "create user",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"name\": \"Imran Khan3\",\r\n    \"email\": \"imrankhan3@gmail.com\",\r\n    \"passwordHash\": \"453015\"\r\n\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{URL}}/user/create",
							"host": [
								"{{URL}}"
							],
							"path": [
								"user",
								"create"
							]
						}
					},
					"response": []
				},
				{
					"name": "Update Profile",
					"request": {
						"method": "GET",
						"header": []
					},
					"response": []
				}
			]
		},
		{
			"name": "Blog",
			"item": [
				{
					"name": "Create Blog",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Authorization",
								"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiaW1yYW5raGFuQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc2MDAwMzc0MiwiZXhwIjoxNzYwMDkwMTQyfQ.ncArrpclQwbCLKodgkeCtpgNekYv72LXBkKEyrN5WDI",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "  {\r\n    \"title\": \"State Management in React: Context, Redux, and Beyond\",\r\n    \"content\": \"Managing state in React applications can be straightforward for small projects but quickly becomes challenging as applications grow. In this blog, we explore different state management approaches, including Context API, Redux Toolkit, Zustand, and other modern libraries. We discuss when to use local state versus global state, patterns for structuring state logic, and best practices for maintaining predictable behavior. Additionally, we cover advanced techniques such as middleware, asynchronous state handling, and integrating state management with APIs. By understanding the strengths and trade-offs of each solution, developers can choose the right approach to keep their React applications scalable and maintainable.\",\r\n    \"summary\": \"Learn about React state management with Context, Redux, and modern libraries, including best practices and advanced patterns.\",\r\n    \"thumbnail\": \"https://the-saltstore.com/wp-content/uploads/2023/10/React-JS.png\",\r\n    \"tags\": [\"REACT\", \"STATE MANAGEMENT\", \"REDUX\"],\r\n    \"authorId\": 1\r\n  }",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{URL}}/blog/create-blog",
							"host": [
								"{{URL}}"
							],
							"path": [
								"blog",
								"create-blog"
							]
						}
					},
					"response": []
				},
				{
					"name": "Get All Blogs",
					"protocolProfileBehavior": {
						"disableBodyPruning": true
					},
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "",
								"type": "text",
								"disabled": true
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"title\": \"This is title\",\r\n    \"content\": \"This is content\",\r\n    \"tags\": [\"blog\", \"imran\", \"ph\"],\r\n    \"authorId\": 2\r\n\r\n}"
						},
						"url": {
							"raw": "{{URL}}/blog/get-blogs",
							"host": [
								"{{URL}}"
							],
							"path": [
								"blog",
								"get-blogs"
							]
						}
					},
					"response": []
				},
				{
					"name": "Blog Update",
					"request": {
						"method": "PATCH",
						"header": [
							{
								"key": "Authorization",
								"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiaW1yYW5raGFuQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc2MDI1ODc1OCwiZXhwIjoxNzYwMzQ1MTU4fQ.K_3Qi2KLZ91oGtE0g1MiFQZjxr4BGkCstb0_8aQgwvI",
								"type": "text"
							}
						],
						"body": {
							"mode": "formdata",
							"formdata": [
								{
									"key": "content",
									"value": "form data update check",
									"type": "text"
								},
								{
									"key": "file",
									"type": "file",
									"src": "/C:/Users/Imran Khan/Downloads/football-turf.jpg"
								},
								{
									"key": "isFeatured",
									"value": "false",
									"type": "text"
								},
								{
									"key": "tags",
									"value": "[\"tag1\", \"tag2\", \"tagCheck\"]",
									"type": "text"
								}
							]
						},
						"url": {
							"raw": "{{URL}}/blog/15",
							"host": [
								"{{URL}}"
							],
							"path": [
								"blog",
								"15"
							]
						}
					},
					"response": []
				},
				{
					"name": "Delete Blog",
					"request": {
						"method": "DELETE",
						"header": [
							{
								"key": "Authorization",
								"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiaW1yYW5raGFuQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc2MDAwMzc0MiwiZXhwIjoxNzYwMDkwMTQyfQ.ncArrpclQwbCLKodgkeCtpgNekYv72LXBkKEyrN5WDI",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"title\": \"Title updated 2\",\r\n    \"isFeatured\": true\r\n}"
						},
						"url": {
							"raw": "{{URL}}/blog/1",
							"host": [
								"{{URL}}"
							],
							"path": [
								"blog",
								"1"
							]
						}
					},
					"response": []
				},
				{
					"name": "Blog Stats",
					"protocolProfileBehavior": {
						"disableBodyPruning": true
					},
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiaW1yYW5raGFuQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc2MDU5OTQ2NiwiZXhwIjoxNzYwNjg1ODY2fQ.IpgonCfQGVIp3S-5WLfLGaqZx2Ke6eDFpSgbGeamDqE",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{URL}}/blog/get-blog-stats",
							"host": [
								"{{URL}}"
							],
							"path": [
								"blog",
								"get-blog-stats"
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "Project",
			"item": [
				{
					"name": "Create Project",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Authorization",
								"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiaW1yYW5raGFuQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc2MDE1NzM3MywiZXhwIjoxNzYwMjQzNzczfQ.jiH0uiNYpIbUAu38J1ou3daWTuDQSyZY6utJhxv8IPE",
								"type": "text"
							}
						],
						"body": {
							"mode": "formdata",
							"formdata": [
								{
									"key": "title",
									"value": "Turf Management SaaS",
									"type": "text"
								},
								{
									"key": "description",
									"value": "A full-featured turf booking and management system with role-based dashboards, manual and online bookings, subscription plans, and SSLCommerz integration.",
									"type": "text"
								},
								{
									"key": "thumbnail",
									"type": "file",
									"src": "/C:/Users/Imran Khan/Downloads/football-turf.jpg"
								},
								{
									"key": "liveUrl",
									"value": "https://github.com/imran-khan-dev/turf-management",
									"type": "text"
								},
								{
									"key": "repoUrl",
									"value": "https://github.com/imran-khan-dev/turf-management",
									"type": "text"
								},
								{
									"key": "features",
									"value": "[\"JWT authentication with OTP verification\", \"Role-based dashboards (Admin, Owner, User)\", \"Manual and online booking support\", \"Subscription and payment tracking\"]",
									"type": "text"
								},
								{
									"key": "ownerId",
									"value": "1",
									"type": "text"
								}
							]
						},
						"url": {
							"raw": "{{URL}}/project/create",
							"host": [
								"{{URL}}"
							],
							"path": [
								"project",
								"create"
							]
						}
					},
					"response": []
				},
				{
					"name": "Update Project",
					"request": {
						"method": "PATCH",
						"header": [
							{
								"key": "Authorization",
								"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiaW1yYW5raGFuQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc2MDE1NzM3MywiZXhwIjoxNzYwMjQzNzczfQ.jiH0uiNYpIbUAu38J1ou3daWTuDQSyZY6utJhxv8IPE",
								"type": "text"
							}
						],
						"body": {
							"mode": "formdata",
							"formdata": [
								{
									"key": "file",
									"type": "file",
									"src": "/C:/Users/Imran Khan/Downloads/Digital Wallet Icon Design.png"
								}
							]
						},
						"url": {
							"raw": "{{URL}}/project/2",
							"host": [
								"{{URL}}"
							],
							"path": [
								"project",
								"2"
							]
						}
					},
					"response": []
				},
				{
					"name": "Get All Project",
					"protocolProfileBehavior": {
						"disableBodyPruning": true
					},
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiaW1yYW5raGFuQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc2MDE1NzM3MywiZXhwIjoxNzYwMjQzNzczfQ.jiH0uiNYpIbUAu38J1ou3daWTuDQSyZY6utJhxv8IPE",
								"type": "text",
								"disabled": true
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"title\": \"Title updated 2\",\r\n    \"isFeatured\": true\r\n}"
						},
						"url": {
							"raw": "{{URL}}/project/get-projects",
							"host": [
								"{{URL}}"
							],
							"path": [
								"project",
								"get-projects"
							]
						}
					},
					"response": []
				},
				{
					"name": "Delete Project",
					"request": {
						"method": "DELETE",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"title\": \"Title updated 2\",\r\n    \"isFeatured\": true\r\n}"
						},
						"url": {
							"raw": "{{URL}}/project/5",
							"host": [
								"{{URL}}"
							],
							"path": [
								"project",
								"5"
							]
						}
					},
					"response": []
				},
				{
					"name": "Project Stats",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiaW1yYW5raGFuQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc2MDU5OTQ2NiwiZXhwIjoxNzYwNjg1ODY2fQ.IpgonCfQGVIp3S-5WLfLGaqZx2Ke6eDFpSgbGeamDqE",
								"type": "text"
							},
							{
								"key": "",
								"value": "",
								"type": "text",
								"disabled": true
							}
						],
						"url": {
							"raw": "{{URL}}/project/get-project-stats",
							"host": [
								"{{URL}}"
							],
							"path": [
								"project",
								"get-project-stats"
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "Auth",
			"item": [
				{
					"name": "User Login",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"email\": \"imrankhan@gmail.com\",\r\n    \"password\": \"453015\"\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{URL}}/auth/login",
							"host": [
								"{{URL}}"
							],
							"path": [
								"auth",
								"login"
							]
						}
					},
					"response": []
				},
				{
					"name": "Log out",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Authorization",
								"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiaW1yYW5raGFuM0BnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NTk1MDc5MDEsImV4cCI6MTc1OTU5NDMwMX0.HAUARo8Apyn7cmiKUQILIihfMc4vw3tWLFlOBa3qdIo",
								"type": "text"
							}
						],
						"url": {
							"raw": "{{URL}}/auth/logout",
							"host": [
								"{{URL}}"
							],
							"path": [
								"auth",
								"logout"
							]
						}
					},
					"response": []
				}
			]
		}
	],
	"event": [
		{
			"listen": "prerequest",
			"script": {
				"type": "text/javascript",
				"packages": {},
				"requests": {},
				"exec": [
					""
				]
			}
		},
		{
			"listen": "test",
			"script": {
				"type": "text/javascript",
				"packages": {},
				"requests": {},
				"exec": [
					""
				]
			}
		}
	],
	"variable": [
		{
			"key": "URL",
			"value": ""
		}
	]
}