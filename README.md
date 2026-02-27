# skill-bridge-digital-literacy
Skill Bridge is a gamified digital literacy platform for rural youth. The system includes learning management with offline access, assessment engine, gamification and certification, and sponsorship support. Developed using a structured branching strategy for collaborative and scalable development.

PORT=5000
MONGO_URI=mongodb://localhost:27017/SkillBridge
JWT_SECRET=skillbridge_secret_key


### Skill Bridge – Component 4  
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
