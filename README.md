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
