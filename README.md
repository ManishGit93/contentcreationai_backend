# ProposalPilot Backend API

AI-powered proposal & scope generator backend API for freelancers and agencies.

## Tech Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing
- OpenAI API for AI-powered proposal generation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory (use `.env.example` as a template):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/proposalpilot
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-api-key
FRONTEND_ORIGIN=http://localhost:3000
NODE_ENV=development
```

3. Make sure MongoDB is running on your system.

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Proposals
- `GET /api/proposals` - Get all proposals for user (protected)
- `GET /api/proposals/:id` - Get a specific proposal (protected)
- `POST /api/proposals` - Create a new proposal (protected)
- `PUT /api/proposals/:id` - Update a proposal (protected)

### Templates
- `GET /api/templates` - Get all templates for user (protected)
- `POST /api/templates` - Create a new template (protected)
- `PUT /api/templates/:id` - Update a template (protected)
- `DELETE /api/templates/:id` - Delete a template (protected)

### AI
- `POST /api/ai/generate-proposal` - Generate proposal using AI (protected)

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Project Structure

```
src/
├── config/          # Database configuration
├── models/          # Mongoose models
├── routes/          # Express routes
├── controllers/     # Route controllers
├── middlewares/     # Express middlewares
├── services/        # Business logic services
├── utils/           # Utility functions
└── index.ts         # Application entry point
```

