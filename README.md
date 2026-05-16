# E-commerceWebsite

Structure:

- `client/` - static frontend
- `desale-backend/` - Express API, MongoDB models, and static file server

## Local run

```bash
npm start
```

Open `http://localhost:3000`.

## MongoDB

The backend uses MongoDB through Mongoose. Set this environment variable in your hosting platform:

```text
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/desale_db?retryWrites=true&w=majority
```

For local testing, you can also use local MongoDB:

```text
MONGODB_URI=mongodb://127.0.0.1:27017/desale_db
```

## GitHub

```bash
git add .
git commit -m "Prepare MongoDB deployment"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Vercel

Deploy the frontend:

- Root Directory: `client`
- Framework Preset: `Other`
- Build Command: leave empty
- Output Directory: leave empty

After your backend is deployed, update `client/js/config.js` with your backend URL.

## Render

Deploy the backend:

- Root Directory: `desale-backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/health`

Environment variable:

- `MONGODB_URI`
- `EMAIL_SERVICE=gmail`
- `EMAIL_USER`
- `EMAIL_PASS` - use a Gmail app password, not your normal Gmail password
- `EMAIL_FROM`

## Railway

Deploy the backend:

- Root Directory: `desale-backend`
- Start Command: `npm start`

Environment variable:

- `MONGODB_URI`
