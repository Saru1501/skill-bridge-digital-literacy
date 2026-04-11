# SkillBridge - Digital Literacy Platform

PORT=5000
MONGO_URI=mongodb://localhost:27017/SkillBridge
JWT_SECRET=skillbridge_secret_key
SkillBridge is a gamified digital literacy platform for rural youth. The system includes learning management with offline access, assessment engine, gamification and certification, and sponsorship support.

## Tech Stack

- **Frontend**: React, React Router, Axios, TailwindCSS, Vite
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Third-Party APIs**: Cloudinary (file storage), Stripe (payments)

## Project Structure

```
SBDL/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   ├── middleware/authMiddleware.js
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

## Features

### Learning Management
- Course creation and management
- Lesson delivery with resources
- Enrollment tracking
- Progress tracking
- Offline content storage (Cloudinary)
- Saved/bookmarked courses

### Gamification
- Points system
- Badges and achievements
- Leaderboard
- Certificates
- Rewards and fee reductions

### Assessment
- Practice missions
- Quiz system
- Performance tracking

### Sponsorship & Support
- NGO sponsorship programs
- Sponsorship applications
- Support ticket system
- Stripe payment integration

## Roles

| Role | Permissions |
|------|-------------|
| Student | Enroll in courses, track progress, earn rewards, apply for sponsorship |
| NGO | Create sponsorship programs, review applications |
| Admin | Manage courses, gamification, badges, certificates, support tickets |

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account (for file storage)
- Stripe account (for payments)

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/SkillBridge
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

Start backend:
```bash
npm run dev
# Server runs at http://localhost:5001
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Frontend runs at http://localhost:5173
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |

### Courses
| Method | Endpoint | Description |
|--------|----------|------------|
| GET | /api/courses | Get all courses |
| GET | /api/courses/:id | Get course |
| POST | /api/courses | Create course (Admin) |
| PUT | /api/courses/:id | Update course (Admin) |
| DELETE | /api/courses/:id | Delete course (Admin) |

### Enrollments
| Method | Endpoint | Description |
|--------|----------|------------|
| POST | /api/enrollments/:courseId | Enroll in course |
| GET | /api/enrollments/my | Get my enrollments |

### Badges
| Method | Endpoint | Description |
|--------|----------|------------|
| GET | /api/badges | Get all badges (Admin) |
| GET | /api/badges/my | Get my badges |
| POST | /api/badges | Create badge (Admin) |

### Points
| Method | Endpoint | Description |
|--------|----------|------------|
| GET | /api/points/rules | Get point rules (Admin) |
| POST | /api/points/rules | Create rule (Admin) |
| GET | /api/points/my | Get my points |

### Certificates
| Method | Endpoint | Description |
|--------|----------|------------|
| GET | /api/certificates | Get all certificates (Admin) |
| GET | /api/certificates/my | Get my certificates |
| POST | /api/certificates/generate/:courseId | Generate certificate |

### Leaderboard
| Method | Endpoint | Description |
|--------|----------|------------|
| GET | /api/leaderboard | Get leaderboard |
| GET | /api/leaderboard/my-rank | Get my rank |

### Sponsorship
| Method | Endpoint | Description |
|--------|----------|------------|
| GET | /api/sponsorship/programs | Get programs |
| POST | /api/sponsorship/programs | Create program (NGO) |
| POST | /api/sponsorship/applications | Apply for sponsorship |
| POST | /api/sponsorship/redeem | Redeem code |

### Tickets
| Method | Endpoint | Description |
|--------|----------|------------|
| POST | /api/tickets | Create ticket |
| GET | /api/tickets/my | My tickets |
| GET | /api/tickets | All tickets (Admin) |

## License

ISC
