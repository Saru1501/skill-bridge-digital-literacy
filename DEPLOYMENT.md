# Deployment Guide

## Architecture

- Deploy `backend/` to Railway.
- Deploy `frontend/` to Vercel.
- Do not deploy the repository root to Vercel. The repo-root `server.js` is not the frontend app.

## 1. Railway backend

Set these Railway environment variables:

```env
PORT=3001
MONGO_URI=...
MONGO_URI_DIRECT=...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
STRIPE_SECRET_KEY=...
CORS_ORIGIN=http://localhost:3000,https://your-vercel-project.vercel.app
```

After deployment, confirm the API is reachable:

- `https://your-railway-backend-domain.up.railway.app/`
- It should return a JSON health response.

Your frontend should use the backend API base with `/api`, for example:

- `https://your-railway-backend-domain.up.railway.app/api`

## 2. Vercel frontend

When importing the GitHub repository into Vercel:

- Set **Root Directory** to `frontend`
- Framework preset: `Create React App`
- Build command: `npm run build`
- Output directory: `build`

Set this Vercel environment variable:

```env
REACT_APP_API_URL=https://your-railway-backend-domain.up.railway.app/api
```

Then redeploy.

## 3. Why the current Vercel deploy fails

The current Vercel error is consistent with deploying the repository root instead of `frontend/`.

The repo root contains `server.js`, and running it from the root currently fails because the root package does not include backend server dependencies such as `express`.

## 4. After deploy

Test these flows from the Vercel URL:

- Open the home page
- Open `/login`
- Sign in or register
- Load courses

If login fails in the browser with a CORS error, update Railway `CORS_ORIGIN` to include the exact Vercel URL and redeploy the backend.
