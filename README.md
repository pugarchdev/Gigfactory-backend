# Gigfactory Backend

Standalone backend scaffold created outside `gigfactory_admin`.

## Run

```bash
cd backend
npm install
npm run dev
```

Server runs at `http://localhost:5000`.

## API Base

`/api`

## Routes

- `GET /api/health`
- `GET|POST|GET by id|PUT|DELETE /api/projects`
- `GET|POST|GET by id|PUT|DELETE /api/case-studies`
- `GET|POST|GET by id|PUT|DELETE /api/expertise`
- `GET|POST|GET by id|PUT|DELETE /api/youtube-videos`
- `GET|POST|GET by id|PUT|DELETE /api/recruitment/agency`
- `GET|POST|GET by id|PUT|DELETE /api/recruitment/freelancer`

This scaffold currently uses in-memory storage (`src/data/store.js`).

