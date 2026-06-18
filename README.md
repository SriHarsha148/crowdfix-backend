CrowdFix — Backend

REST API powering CrowdFix, a civic issue-reporting platform that lets citizens report local infrastructure problems (roads, water, power, waste, traffic) and lets municipal officials track and resolve them.

This is the API server. The companion UI lives in crowdfix-frontend.

Tech Stack


Runtime: Node.js
Framework: Express 5
Database: MongoDB with Mongoose
Auth: JSON Web Tokens (JWT) + bcrypt password hashing
Dev tooling: nodemon


Features


Email/password registration and login with hashed passwords and signed JWTs
Two user roles — citizen and official — with role-gated routes
Issue reporting with auto-generated human-readable tracking IDs (CRX-XXXXX)
Lookup an issue by its Mongo _id or its tracking ID
Filter issues by category and status
Community upvoting on issues
Officials-only status workflow: open → in_progress → resolved
Citizens earn 10 points per reported issue (groundwork for the leaderboard)
Seed script to create a default official/admin account


Project Structure

crowdfix-backend/
├── server.js          # App entry point, middleware, route mounting
├── createAdmin.js      # One-off script to seed an official account
├── middleware/
│   └── auth.js          # JWT verification middleware
├── models/
│   ├── User.js           # User schema
│   └── Issue.js           # Issue schema
└── routes/
    ├── auth.js            # /api/auth routes
    └── issues.js           # /api/issues routes

Getting Started

Prerequisites


Node.js (v18+ recommended)
A MongoDB database (local instance or a MongoDB Atlas cluster)


Installation

bashgit clone https://github.com/SriHarsha148/crowdfix-backend.git
cd crowdfix-backend
npm install

Environment Variables

Create a .env file in the project root:

VariableDescriptionRequiredMONGO_URIMongoDB connection stringYesJWT_SECRETSecret used to sign/verify JWTsYesPORTPort the server listens onNo (defaults to 5000)

Running the server

bashnpm start      # production
npm run dev    # development, auto-restarts on file changes via nodemon

The API will be available at http://localhost:5000/api (or whichever PORT you set). Visiting http://localhost:5000/ returns a simple health check JSON response.

Seeding an official account

The frontend's admin panel only allows users with the official role to view it. To create one:

bashnode createAdmin.js

This creates admin@crowdfix.in / admin123. Change this password (or the script) before deploying anywhere public.

API Reference

Base URL: /api

Auth

MethodEndpointAuthBodyDescriptionPOST/auth/registerNo{ name, email, password }Create a citizen account, returns a JWTPOST/auth/loginNo{ email, password }Authenticate, returns a JWT

Issues

MethodEndpointAuthBody / QueryDescriptionGET/issuesNo?category=&status= (optional)List all issues, newest firstGET/issues/:idNo—Get one issue by Mongo _id or tracking ID (CRX-XXXXX)GET/issues/track/:trackingIdNo—Get one issue by tracking ID explicitlyPOST/issuesYes{ title, description, category, priority, location }Create an issue; reporter gets +10 pointsPATCH/issues/:id/voteNo—Upvote an issuePATCH/issues/:id/statusYes (official role){ status }Update status (open, in_progress, resolved)

category must be one of: road, water, power, waste, traffic, other.
priority must be one of: low, medium, high, critical (defaults to medium).

For authenticated routes, send the JWT as Authorization: Bearer <token>.

Data Models

User


name, email (unique), password (hashed) — required
role: citizen | official (default citizen)
points: Number (default 0)


Issue


trackingId: auto-generated, unique, format CRX-#####
title, description, location — required
category: enum, required
priority: enum (default medium)
status: enum (default open)
votes: Number (default 0)
reportedBy: reference to User


Notes


server.js currently logs MONGO_URI to the console on startup — useful for local debugging, but worth removing before deploying anywhere your logs aren't private, since a connection string often embeds DB credentials.
There's no GET endpoint for a ranked leaderboard yet, even though points are tracked per user — the leaderboard shown on the frontend is currently static placeholder content.


License

ISC
