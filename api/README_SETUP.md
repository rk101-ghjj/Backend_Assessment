Setup

1. Create an `.env` file in `api` based on the following:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=nest_api
TYPEORM_SYNC=true
TYPEORM_LOGGING=false
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=1h
```

2. Install dependencies and run:

```
npm install
npm run start:dev
```

3. Endpoints

- Auth: `POST /auth/register`, `POST /auth/login`
- Users: `POST /users`, `GET /users`, `GET /users/:id`, `PATCH /users/:id`, `DELETE /users/:id`
- Items (JWT required): `POST /items`, `GET /items`, `GET /items/:id`, `PATCH /items/:id`, `DELETE /items/:id`

Notes

- Validation is globally enabled. Only whitelisted properties are allowed.
- JWT is issued with `sub`, `email`, `role` claims.
- TypeORM synchronize is controlled by `TYPEORM_SYNC`.


