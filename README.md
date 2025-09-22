# Dbify

<img width="1861" height="916" alt="image" src="https://github.com/user-attachments/assets/3188d43f-823a-4c04-8e25-2edad4ba235a" />

Dbify is a platform that allows users to instantly generate CRUD APIs on top of their existing PostgreSQL databases. Users simply provide their PostgreSQL connection URL, and Dbify handles the rest by exposing secure, scalable, and feature-rich APIs without requiring schema migrations or data replication.

---

## 🚀 Features

* **Instant CRUD API**: Generate full CRUD APIs for your PostgreSQL database by just providing the DB connection URL.
* **User Dashboard**:

  * View project details, API keys, and activity logs.
  * Logs of all API calls with:

    * Total number of requests
    * Average response time
    * Request timestamps
    * Schema change logs
  * Proper UI/UX with a graphical interface.
* **Schema Change Detection**:

  * Triggers events when schema structure changes.
  * Notifies users via email.
  * Updates cache automatically for faster operations.
* **Scalable & Performant**:

  * Uses PgBouncer for efficient connection pooling and horizontal scaling.
  * Queue + Workers architecture for log handling and analytics.
  * Data saved into time-series DB (Clickhouse) for fast analytics.
* **Enhanced Search & Queries**:

  * Support for specific query-based APIs.
  * Integration with **Elasticsearch** for full-text search.
  * Integration with **Vector DBs** for semantic search.
* **Developer Friendly**:

  * API linter setup.
  * Built-in API documentation.
  * Support for cron operations.

   <img width="1854" height="936" alt="image" src="https://github.com/user-attachments/assets/a61b8bc1-f568-453b-ae06-bb8852ab6fa4" />
   <img width="1552" height="822" alt="image" src="https://github.com/user-attachments/assets/223e953b-a000-4d48-b28b-aaf18e21112a" />
   <img width="1538" height="939" alt="image" src="https://github.com/user-attachments/assets/496b53e7-6f19-4989-b9d6-4d456e7968b0" />




---

## 📐 Architecture

Below is the high-level system architecture of Dbify: <img width="1861" height="916" alt="image" src="https://github.com/user-attachments/assets/3188d43f-823a-4c04-8e25-2edad4ba235a" />

### Flow

1. **Users** provide their PostgreSQL DB URL to the **Server**.
2. **Server**:

   * Stores DB URL in Dbify’s database.
   * Returns `apiKey` and `projectId`.
   * Caches user tables for faster access.
   * Updates cache when schema changes are detected.
3. **Schema Changes**:

   * Trigger events when schema structure is modified.
   * Notify users via **Email**.
4. **Logs**:

   * API request logs are pushed into a **Message Queue**.
   * **Workers** consume logs and store them in **ClickhouseDB** for analytics.
5. **User Dashboard**:

   * Displays logs, usage stats, API keys, and schema change history.
   * Provides graphical analytics powered by Clickhouse.

---

## 🛠️ Notes & Recommendations

* Use **PgBouncer** for better pool connection management and efficient horizontal scaling.
* Implement **API linter** to enforce consistency.
* Add **cron job support** for scheduled operations.
* Provide **in-built API documentation** for developers.
* Extend integrations with:

  * **Elasticsearch** for full-text search.
  * **Vector DBs** for semantic search.

---

## 📊 Tech Stack

* **Backend**: Node.js / Express (with PostgreSQL driver)
* **Database**: PostgreSQL (user DB), Clickhouse (analytics)
* **Queue**: Kafka / RabbitMQ
* **Workers**: Node.js / Go-based workers for async tasks
* **Search**: Elasticsearch, Vector DBs
* **Connection Management**: PgBouncer
* **Cache**: Redis
* **Email Notifications**: SES / Sendgrid

---

## 🚀 Quick Start

1. **Provide your PostgreSQL URL**
   Example:

   ```
   postgres://username:password@host:5432/mydb
   ```

2. **Dbify gives you**:

   * `projectId`
   * `apiKey`
   * Ready-to-use endpoints for all tables in your DB.

---

## 📘 Example API Usage

### Read Operation

```json
{
  "projectId": 4,
  "apiKey": "4148f85d8ae6a3914f",
  "operation": "read",
  "payload": {
    "id": 3
  },
  "tableName": "Project"
}
```

### Update Operation

```json
{
  "projectId": 4,
  "apiKey": "4148f85d8ae6a3914f",
  "operation": "update",
  "payload": {
    "where": { "email": "test" },
    "data": {
      "email": "test@gmail",
      "password": "test",
      "name": "test@new"
    }
  },
  "tableName": "User"
}
```

### Create Operation

```json
{
  "projectId": 4,
  "apiKey": "4148f85d8ae6a3914f",
  "operation": "create",
  "payload": {
    "data": {
      "title": "New Project",
      "description": "This is a new project"
    }
  },
  "tableName": "Project"
}
```

### Delete Operation

```json
{
  "projectId": 4,
  "apiKey": "4148f85d8ae6a3914f",
  "operation": "delete",
  "payload": {
    "where": { "id": 3 }
  },
  "tableName": "Project"
}
```

---

## 🌐 Example cURL Requests

### Read Example

```bash
curl -X POST https://api.dbify.com/query \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 4,
    "apiKey": "4148f85d8ae6a3914f",
    "operation": "read",
    "payload": { "id": 3 },
    "tableName": "Project"
  }'
```

### Create Example

```bash
curl -X POST https://api.dbify.com/query \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 4,
    "apiKey": "4148f85d8ae6a3914f",
    "operation": "create",
    "payload": { "data": { "title": "New Project" } },
    "tableName": "Project"
  }'
```

---

## 📖 Documentation

* **Authentication**: Every request must include `projectId` and `apiKey`.
* **Supported Operations**: `create`, `read`, `update`, `delete`.
* **Error Handling**: Returns structured JSON with `errorCode`, `message`, and `details`.
* **Schema Sync**: Automatically detects schema changes and updates endpoints accordingly.

---

## ✅ Best Practices

* Rotate your `apiKey` regularly.
* Use role-based access (upcoming feature) for fine-grained control.
* Monitor schema change logs in the dashboard.
* Combine with Elasticsearch/Vector DB integration for advanced search features.
