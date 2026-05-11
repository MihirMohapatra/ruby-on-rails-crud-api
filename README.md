# Ruby on Rails CRUD API

A small Dockerized Rails API backed by PostgreSQL. It exposes CRUD endpoints for `products`.

## Requirements

- Docker
- Docker Compose

## Getting Started

Build the containers:

```sh
docker compose build
```

Create and migrate the database:

```sh
docker compose run --rm api bin/rails db:create db:migrate
```

Start the API:

```sh
docker compose up
```

The API will be available at `http://localhost:3000`.

Open `http://localhost:3000` in a browser to use the product manager UI.

## UI Preview

![Product manager UI](docs/ui-screenshot.png)

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | Product manager UI |
| `GET` | `/products` | List products |
| `GET` | `/products/:id` | Show a product |
| `POST` | `/products` | Create a product |
| `PATCH`/`PUT` | `/products/:id` | Update a product |
| `DELETE` | `/products/:id` | Delete a product |
| `GET` | `/up` | Health check |

## Example Requests

Create a product:

```sh
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"product":{"name":"Notebook","description":"A5 ruled notebook","price":5.99,"quantity":25}}'
```

List products:

```sh
curl http://localhost:3000/products
```

Update a product:

```sh
curl -X PATCH http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{"product":{"quantity":40}}'
```

Delete a product:

```sh
curl -X DELETE http://localhost:3000/products/1
```

## Environment Variables

The Docker Compose setup provides sensible development defaults:

| Variable | Default | Purpose |
| --- | --- | --- |
| `DATABASE_HOST` | `db` | Postgres host |
| `DATABASE_USERNAME` | `postgres` | Postgres user |
| `DATABASE_PASSWORD` | `postgres` | Postgres password |
| `RAILS_ENV` | `development` | Rails environment |

For production hosting, set:

| Variable | Purpose |
| --- | --- |
| `RAILS_ENV` | Set to `production` |
| `DATABASE_URL` | Hosted PostgreSQL connection string |
| `SECRET_KEY_BASE` | Rails production secret |
| `RAILS_SERVE_STATIC_FILES` | Set to `true` |

## Deploy With Neon and Render

Use Neon for the PostgreSQL database and Render for the Dockerized Rails web service.

### 1. Create the Neon Database

1. Create a free Neon project.
2. Create or use the default database.
3. Copy the PostgreSQL connection string. It should look like:

```txt
postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require
```

Keep this value secret. Do not commit the real connection string to GitHub.

### 2. Create the Render Web Service

1. In Render, choose **New** -> **Web Service**.
2. Connect this GitHub repository.
3. Use these settings:

| Setting | Value |
| --- | --- |
| Runtime / Language | `Docker` |
| Branch | `main` |
| Dockerfile Path | `./Dockerfile` |
| Docker Build Context Directory | `.` |
| Instance Type | `Free` |

For Docker deploys, Render builds from the `Dockerfile`, so leave command fields blank if Render shows them:

| Field | Value |
| --- | --- |
| Build Command | Leave blank |
| Start Command / Docker Command | Leave blank |

The Dockerfile already starts the app with:

```sh
bundle exec rails db:migrate && bundle exec rails server -b 0.0.0.0 -p ${PORT:-3000}
```

### 3. Add Render Environment Variables

In the Render service, open **Environment** and add:

| Variable | Value |
| --- | --- |
| `RAILS_ENV` | `production` |
| `DATABASE_URL` | Your Neon connection string |
| `RAILS_SERVE_STATIC_FILES` | `true` |
| `SECRET_KEY_BASE` | A long random secret |

Generate a secret locally with:

```sh
openssl rand -hex 64
```

If `openssl` is not available, use any long random string with at least 64 characters.

### 4. Deploy

Click **Deploy Web Service**. After deploy finishes, open the Render service URL. The product manager UI is available at `/`, and the API endpoints are available under `/products`.

To restart the app later, use **Manual Deploy** -> **Deploy latest commit** in Render. To stop the free service, use **Settings** -> **Suspend Service**, then **Resume Service** when needed.

## Useful Commands

Run migrations:

```sh
docker compose run --rm api bin/rails db:migrate
```

Open a Rails console:

```sh
docker compose run --rm api bin/rails console
```

Run tests:

```sh
docker compose run --rm api bin/rails test
```
