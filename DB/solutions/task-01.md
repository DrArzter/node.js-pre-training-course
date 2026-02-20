# Task 01: Setting Up and Creating the "users" and "todos" Tables with Raw SQL

## Step 1: Install a Relational Database

I decided to use **PostgreSQL**.

I use Docker and Docker Compose to run PostgreSQL locally.
Below is the `docker-compose.yml` configuration I used:

```yaml
services:
  db:
    image: postgres:15
    container_name: my_postgres
    restart: unless-stopped

    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: postgres

    ports:
      - "5432:5432"

    volumes:
      - database_data:/var/lib/postgresql/data

    networks:
      - my_network

volumes:
  database_data:

networks:
  my_network:
    driver: bridge
```

To start the PostgreSQL container, I used:

```bash
docker-compose up -d
```

To access PostgreSQL inside the container:

```bash
docker exec -it my_postgres psql -U postgres
```

## Step 2: Install a Database GUI Tool

I chose **Azure Data Studio** as my GUI tool.

I use Arch Linux, so I installed it using:

```bash
yay -S azuredatastudio-bin
```

To connect to PostgreSQL, I installed the **PostgreSQL extension by Microsoft** inside Azure Data Studio:

Extensions → Search for "PostgreSQL" → Install.

## Step 3: Create a New Database

Although the container automatically creates a default database named `postgres`, the assignment requires creating a new database.

First, i connected to docker container using:

```bash
docker exec -it my_postgres psql -U postgres
```

Inside the PostgreSQL terminal, I executed:

```sql
CREATE DATABASE todo_app;
```

Then I connected to the new database:

```sql
\c todo_app;
```

## Step 4: Create the Tables Using Raw SQL

### Create `todos` Table

```sql
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL CHECK (title <> ''),
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL
);
```

To verify that the table was created successfully, I ran:

```sql
\d todos;
```

## Summary

- I used Docker and Docker Compose to run PostgreSQL locally.
- I installed Azure Data Studio as a GUI tool.
- I created a new database named `todo_app`.
- I created table `todos`.
- The todos table includes a user_id column that will be linked to users(id) via a foreign key in task-04.
- I verified the table structures using `\d` command in PostgreSQL.
- No issues were encountered during setup or execution of the SQL commands.
- SQL queries are documented in this [solution file](task-01.sql).
