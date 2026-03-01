# skill-bridge-digital-literacy
Skill Bridge is a gamified digital literacy platform for rural youth. The system includes learning management with offline access, assessment engine, gamification and certification, and sponsorship support. Developed using a structured branching strategy for collaborative and scalable development.

PORT=5000
MONGO_URI=mongodb://localhost:27017/SkillBridge
JWT_SECRET=skillbridge_secret_key

<<<<<<< HEAD
Component 1 — Learning Management & Offline Delivery Engine
SkillBridge Digital Literacy Platform
SE3040 - Application Frameworks | SLIIT 2026 Developed by: Shathursini IT23164062
Overview
Component 1 handles all learning management features for the SkillBridge platform. It delivers structured digital literacy learning content with offline access for rural youth. This includes course creation, lesson delivery, enrollment tracking, learning progress management, and offline content storage.

Tech Stack
•	Runtime: Node.js
•	Framework: Express.js
•	Database: MongoDB Atlas (Mongoose)
•	File Storage: Cloudinary (Third-party API)
•	Authentication: JWT (JSON Web Tokens)
•	File Upload: Multer

Folder Structure
skill-bridge-digital-literacy/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── courseController.js
│   │   ├── lessonController.js
│   │   ├── enrollmentController.js
│   │   ├── progressController.js
│   │   └── savedCourseController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Course.js
│   │   ├── Lesson.js
│   │   ├── Enrollment.js
│   │   ├── Progress.js
│   │   └── SavedCourse.js
│   ├── routes/
│   │   ├── courseRoutes.js
│   │   ├── lessonRoutes.js
│   │   ├── enrollmentRoutes.js
│   │   ├── progressRoutes.js
│   │   └── savedCourseRoutes.js
│   └── utils/
│       └── cloudinary.js
├── .env
├── .gitignore
├── package.json
└── server.js

Setup Instructions
Prerequisites
•	Node.js v18 or higher
•	MongoDB Atlas account
•	Cloudinary account
Step 1: Clone the Repository
git clone https://github.com/Saru1501/skill-bridge-digital-literacy.git
cd skill-bridge-digital-literacy
Step 2: Switch to Component Branch
git checkout "Learning-Management-&-Offline-Delivery-Engine"
Step 3: Install Dependencies
npm install
Step 4: Configure Environment Variables
Create a .env file in the root directory:
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/SkillBridge
JWT_SECRET=skillbridge_secret_key
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
Step 5: Run the Server
Development mode
npm run dev

Production mode
npm start
Server will run on: http://localhost:5000
________________________________________
API Endpoints
Base URL
http://localhost:5000/api
Authentication
All protected routes require:
Authorization: Bearer <your_jwt_token>









Auth Routes
Method	Endpoint	Description	Access
POST	/api/auth/register	Register new user	Public
POST	/api/auth/login	Login user	Public
GET	/api/auth/me	Get current user	Private


Register Example:
POST /api/auth/register
{
  "name": "Test User",
  "email": "test@gmail.com",
  "password": "123456",
  "role": "student"
}
Login Example:
POST /api/auth/login
{
  "email": "test@gmail.com",
  "password": "123456"
}

Course Routes
Method	Endpoint	Description	Access
POST	/api/courses	Create course	Admin
GET	/api/courses	Get all courses (search, filter, paginate)	Private
GET	/api/courses/:id	Get single course	Private
PUT	/api/courses/:id	Update course	Admin
DELETE	/api/courses/:id	Delete course	Admin
PATCH	/api/courses/:id/publish	Publish/Unpublish course	Admin


Create Course Example:
POST /api/courses
{
  "title": "Basic Computer Skills",
  "description": "Learn the fundamentals of using a computer",
  "category": "Basic IT",
  "level": "beginner",
  "tags": ["computer", "basics", "IT"]
}
Search & Filter:
GET /api/courses?search=computer&category=Basic IT&level=beginner&page=1&limit=10

Lesson Routes
Method	Endpoint	Description	Access
POST	/api/courses/:courseId/lessons	Add lesson to course	Admin
GET	/api/courses/:courseId/lessons	Get all lessons in course	Private
GET	/api/lessons/:id	Get single lesson	Private
PUT	/api/lessons/:id	Update lesson	Admin
DELETE	/api/lessons/:id	Delete lesson	Admin
POST	/api/lessons/:id/resources	Upload resource (Cloudinary)	Admin
DELETE	/api/lessons/:id/resources/:resourceId	Delete resource	Admin


Add Lesson Example:
POST /api/courses/:courseId/lessons
{
  "title": "Introduction to Computers",
  "description": "What is a computer and how it works",
  "content": "A computer is an electronic device...",
  "order": 1,
  "duration": 15
}

Enrollment Routes
Method	Endpoint	Description	Access
POST	/api/enrollments/:courseId	Enroll in course	Student
GET	/api/enrollments/my	Get my enrollments	Student
GET	/api/enrollments/:courseId/status	Check enrollment status	Private
GET	/api/enrollments/course/:courseId	Get all enrollments for course	Admin

Progress Routes
Method	Endpoint	Description	Access
PATCH	/api/progress/:courseId/lessons/:lessonId	Update lesson progress	Student
GET	/api/progress/:courseId	Get course progress	Student
POST	/api/progress/:courseId/download	Track offline download	Student
POST	/api/progress/:courseId/sync	Sync offline progress	Student




Sync Offline Progress Example:
POST /api/progress/:courseId/sync
{
  "completedLessons": ["lessonId1", "lessonId2"]
}

Saved Courses Routes
Method	Endpoint	Description	Access
POST	/api/saved/:courseId	Save / Unsave course	Student
GET	/api/saved	Get my saved courses	Student

Core Business Logic
•	Course Visibility - Students can only see published courses
•	Enrollment Tracking - Prevents duplicate enrollments
•	Progress Calculation - Auto-calculates completion percentage based on completed lessons
•	Course Completion - Auto-marks course as complete when 100% lessons done
•	Offline Sync - Students can sync offline progress when back online
•	Resource Download Tracking - Tracks which resources a student downloaded

Third-Party API Integration
Cloudinary
Used for uploading and storing learning resources (PDFs, videos, slides).
•	Admin uploads files → Express sends to Cloudinary → URL saved in MongoDB
•	Students access resources via the stored Cloudinary URL
•	Supports: PDF, Video, Slides, and other file types



Role-Based Access Control
Role	Permissions
Admin	Create/Edit/Delete courses, lessons, resources. Publish/Unpublish courses. View all enrollments.
Student	Browse/Search courses. Enroll. View lessons. Track progress. Save courses. Download resources.

Models
Model	Description
Course	Course info, category, level, publish status
Lesson	Lessons with embedded resources
Enrollment	Student-course enrollment records
Progress	Lesson completion, percentage, offline downloads
SavedCourse	Courses bookmarked by students

Outputs to Other Components
This component emits the following events consumed by other components:
•	Lesson Completion Event - Component 3 (Gamification)
•	Course Completion Event - Component 3 (Gamification) & Component 2 (Assessment)
•	Progress Update Event - Component 3 (Gamification)








Environment Variables
Variable	Description
MONGO_URI	MongoDB Atlas connection string
JWT_SECRET	Secret key for JWT token generation
PORT	Server port (default: 5000)
CLOUDINARY_CLOUD_NAME	Cloudinary cloud name
CLOUDINARY_API_KEY	Cloudinary API key
CLOUDINARY_API_SECRET	Cloudinary API secret


Dependencies
{
  "bcryptjs": "^3.0.3",
  "cloudinary": "^2.9.0",
  "cors": "^2.8.6",
  "dotenv": "^17.3.1",
  "express": "^5.2.1",
  "jsonwebtoken": "^9.0.3",
  "mongoose": "^9.2.1",
  "multer": "^2.0.2",
  "nodemon": "^3.1.14"
}

Author
ShathursiniJ - Component 1: Learning Management & Offline Delivery Engine SE3040 Application Frameworks | SLIIT 2026

=======

<<<<<<< HEAD
Skill Bridge – Component 4  
=======
### Skill Bridge – Component 4  
>>>>>>> Sponsorship,-Payment-&-Support-Management
Sponsorship & Support Management  

📌 Component Overview
This component is responsible for managing:

1. NGO Sponsorship Programs  
2. Student Sponsorship Applications  
3. Sponsorship Code Redemption  
4. Support Ticket System  
5. Stripe Payment Integration (Third-Party API)  

The purpose of this component is to enable financially challenged rural students to continue their education through NGO sponsorship programs and to provide a structured support system for resolving platform-related issues.

🎯 Main Objective

To design and implement a secure RESTful backend system that:

- Allows NGOs to create and manage sponsorship programs  
- Allows students to apply for sponsorship assistance  
- Allows NGOs to review and approve/reject applications  
- Automatically generates sponsorship codes for approved students  
- Allows students to redeem sponsorship codes  
- Allows students to raise support tickets  
- Allows Admin to manage and resolve support tickets  
- Integrates Stripe API for payment processing  

This component follows RESTful architecture and uses role-based access control.

👥 Roles & Access Control (RBAC)

Authentication: JWT Token  
Authorization: Role-Based Middleware  

| Role      | Access Permissions |
|------------|--------------------|
| Student    | Apply for sponsorship, redeem code, create tickets, create payment intent |
| NGO        | Create sponsorship programs, review applications |
| Admin      | View and resolve support tickets |
| University | No direct access to this component |
| Mentor     | No direct access to this component |

🔌 Third-Party API Integration

Stripe API (Payment Intent)

Stripe is integrated to demonstrate third-party API usage for course payment processing.

Endpoint:
```
POST /api/payments/intent
```

Returns:
- clientSecret
- paymentIntentId

This satisfies the assignment requirement for third-party API integration.

🗂 Database Collections Used

- users
- sponsorshipPrograms
- sponsorshipApplications
- supportTickets
- payments

🔗 REST API Endpoints

🔹 Sponsorship Programs

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/sponsorship/programs | NGO |
| GET  | /api/sponsorship/programs | Authenticated Users |

🔹 Sponsorship Applications

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/sponsorship/applications | Student |
| GET  | /api/sponsorship/applications | NGO |
| PUT  | /api/sponsorship/applications/:id/status | NGO |

🔹 Redeem Sponsorship

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/sponsorship/redeem | Student |

🔹 Support Tickets

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/tickets | Student |
| GET  | /api/tickets/my | Student |
| GET  | /api/tickets | Admin |
| PUT  | /api/tickets/:id/status | Admin |

🔹 Stripe Payment

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/payments/intent | Student |

🚀 How to Run the Project

1️⃣ Install Dependencies
npm install

2️⃣ Setup Environment Variables (.env)

Create a `.env` file in the root directory:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key

3️⃣ Start the Server

npm run dev


Server will run at:
http://localhost:5000


🧪 API Testing

API testing was performed using Postman.

Testing Flow

1. Register NGO, Student, and Admin
2. NGO creates sponsorship program
3. Student applies for sponsorship
4. NGO approves application
5. Student redeems sponsorship code
6. Student creates support ticket
7. Admin resolves support ticket
8. Student creates Stripe payment intent

🏗 Architecture Design

This component follows:

- MVC Architecture Pattern
- RESTful API Design
- JWT Authentication
- Role-Based Authorization
- MongoDB with Mongoose ODM
- Stripe Third-Party API Integration

👨‍💻 Developed By

Name: Sarumathy.V 
Component: Sponsorship & Support Management  
Module: SE3040 – Application Frameworks  
University: SLIIT  
<<<<<<< HEAD
>>>>>>> 7c5c975 (docs(component-4): add complete README with API documentation and setup guide)
>>>>>>> 7417e38 (fix: resolve dependency conflicts after rebase)
=======
>>>>>>> Sponsorship,-Payment-&-Support-Management
>>>>>>> 1105fe3069b511824542e81a23f2f1fda6d16bc3
