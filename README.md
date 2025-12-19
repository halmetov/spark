# Spark Library – Frontend + Django API

This project now uses a self-hosted PostgreSQL database exposed via a Django + DRF backend. Supabase has been removed entirely; content is managed through Django Admin.

## Contents
- `backend/`: Django project (`config`) with a `content` app exposing read-only REST endpoints and an Admin UI for CRUD.
- Frontend (Vite + React + TypeScript) consuming the REST API via `VITE_API_URL`.

## Prerequisites
- Node.js 18+
- Python 3.12+
- PostgreSQL 15+ (local or container)

## Backend setup
1. Copy env template:
   ```sh
   cp backend/.env.example backend/.env
   ```
   Update `DATABASE_URL`, `DJANGO_SECRET_KEY`, `CORS_ALLOWED_ORIGINS`, and hosts as needed.

2. Install Python deps (inside a venv is recommended):
   ```sh
   python -m venv .venv
   source .venv/bin/activate
   pip install -r backend/requirements.txt
   ```

3. Apply migrations and create an admin user:
   ```sh
   cd backend
   python manage.py migrate
   python manage.py createsuperuser
   ```

4. Run the server:
   ```sh
   python manage.py runserver 0.0.0.0:8000
   ```

5. Django Admin is at `http://localhost:8000/admin`.

## Frontend setup
1. Copy the env template:
   ```sh
   cp .env.example .env
   ```
   Make sure `VITE_API_URL` points to your Django server (default `http://localhost:8000`).

2. Install and run:
   ```sh
   npm install
   npm run dev
   ```

## API endpoints
All endpoints are public read-only under `/api/`:
- `GET /api/books/` (optional `?category_id=<uuid>`)
- `GET /api/books/<id>/`
- `GET /api/categories/`
- `GET /api/partners/`
- `GET /api/team-members/`

## Docker Compose (optional)
Run Postgres and the backend together:
```sh
docker-compose up --build
```
Backend will listen on `8000`, Postgres on `5432`. Adjust env values in `docker-compose.yml` as needed.

## Supabase ➜ PostgreSQL migration (one-time)
1. In Supabase, export each table (`books`, `categories`, `partners`, `team_members`) to CSV.
2. Prepare a PostgreSQL database that matches `DATABASE_URL` and ensure migrations have run.
3. Import CSVs with `psql`:
   ```sh
   psql "$DATABASE_URL" <<'SQL'
   \copy content_category(id, name, description, created_at, updated_at) FROM '/path/categories.csv' CSV HEADER;
   \copy content_book(id, title, author, description, content, cover_image, category_id, created_at, updated_at) FROM '/path/books.csv' CSV HEADER;
   \copy content_partner(id, name, logo, website_url, created_at, updated_at) FROM '/path/partners.csv' CSV HEADER;
   \copy content_teammember(id, name, role, photo, created_at, updated_at) FROM '/path/team_members.csv' CSV HEADER;
   SQL
   ```
   Adjust paths as needed. UUIDs from Supabase are preserved.
4. Verify data in Django Admin and on the site (`npm run dev` + `python manage.py runserver`).

## Notes
- Frontend design remains unchanged; only the data layer now targets the Django REST API.
- All content changes should be performed via Django Admin.
