# Dbify

Dbify is a unified platform that instantly generates secure, production-ready APIs on top of any database—whether it’s SQL (PostgreSQL, MySQL), NoSQL (MongoDB, Cassandra), reactive (Convex), graph (Neo4j), or vector (Pinecone, Weaviate)—by abstracting away complexity and exposing feature-rich, auto-scaled APIs without the need for schema migrations or data replication.

✅ **Your data, your control** – Dbify never replicates or moves your data, ensuring zero vendor lock-in.

---

## 🚀 Features

### 🔹 Instant CRUD API

* Generate full CRUD APIs by simply providing a DB connection URL.
* Endpoints auto-generated for every table/collection.

### 🔹 User Dashboard

* View project details, API keys, and activity logs.
* Logs include:

  * Total requests
  * Avg response time
  * Request timestamps
  * Schema change history
* Modern UI/UX with real-time graphical analytics.

### 🔹 Schema Change Detection

* Auto-detects schema changes in your DB.
* Triggers events + sends email alerts.
* Updates in-memory cache instantly for faster API responses.

### 🔹 Scalability & Performance

* **PgBouncer** for efficient connection pooling & horizontal scaling.
* **Queue + Workers** for async log handling & analytics.
* **ClickHouse** for time-series API analytics (blazing fast).

### 🔹 Enhanced Queries & Search

* SQL + NoSQL query builder APIs.
* **Elasticsearch** integration for full-text search.
* **Vector DB** integration for semantic search.

### 🔹 Enterprise Authentication (Better-Auth)

*  Social sign-on (Google, GitHub, Discord, Twitter)
*  Role-Based Access Control (Admin, Developer, Viewer)


### 🔹 Notifications (Resend)

* Schema change alerts via email.
* Usage spike notifications.
* Team invites & collaboration updates.

### 🔹 Developer Friendly

* Built-in API documentation.
* API linter for consistent design.
* Cron job support for scheduled operations.
* AI-powered assistant (trained on Postgres, React, & your schema).

---

## 📐 System Architecture

<img width="1861" height="916" alt="image" src="https://github.com/user-attachments/assets/3188d43f-823a-4c04-8e25-2edad4ba235a" />

### High-Level Flow

1. **Users** provide their database connection details → **Dbify Server**.
2. **Server**:

   * Validates & securely stores connection details.
   * Returns `apiKey` + `projectId`.
   * Introspects and caches schema.
   * Continuously monitors for schema changes.
3. **Schema Changes**:

   * Trigger events + notify users via email.
   * Auto-update cached schema.
4. **Logs & Analytics**:

   * API logs pushed into **Message Queue**.
   * **Workers** process logs → store in **ClickHouse**.
   * Provide database-specific performance metrics.
5. **Dashboard**:

   * Live API usage stats via **Convex**.
   * Real-time schema change notifications.
   * Collaborative monitoring & analytics.

### Subsystems

* **Authentication System (Better-Auth)**:

  * Social login support
  * RBAC + Secure API key management
* **Notification System (Resend)**:

  * Email alerts, reports, team invites
* **Analytics Pipeline**:

  * Real-time logging via Convex
  * Workers → ClickHouse for querying
* **Cache & Scaling**:

  * Redis for hot data
  * PgBouncer for pooling

---

## 📊 Tech Stack

* **Backend**: Node.js / Express
* **Primary DB**: PostgreSQL (user DB)
* **Analytics**: Convex 
* **Queue**: RabbitMQ
* **Workers**: Node.js
* **Search**: Elasticsearch, Vector DBs
* **Cache**: Redis
* **Connection Management**: PgBouncer
* **Notifications**: ReSend
* **Auth**: Better-Auth

---

## 🚀 Quick Start

1. **Provide your DB connection URL**

   ```
   postgres://username:password@host:5432/mydb
   ```
2. **Dbify gives you**:

   * `projectId`
   * `apiKey`
   * Auto-generated CRUD endpoints for your DB tables

---

## 📘 Example API Usage

### Read Operation

```json
{
  "projectId": 4,
  "apiKey": "4148f85d8ae6a3914f",
  "operation": "read",
  "payload": { "id": 3 },
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
    "data": { "email": "test@gmail", "password": "test", "name": "test@new" }
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
  "payload": { "data": { "title": "New Project", "description": "This is a new project" } },
  "tableName": "Project"
}
```

### Delete Operation

```json
{
  "projectId": 4,
  "apiKey": "4148f85d8ae6a3914f",
  "operation": "delete",
  "payload": { "where": { "id": 3 } },
  "tableName": "Project"
}
```

---

## 🌐 Example cURL

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

---

## 📖 Documentation
   <img width="1854" height="936" alt="image" src="https://github.com/user-attachments/assets/a61b8bc1-f568-453b-ae06-bb8852ab6fa4" />
   <img width="1552" height="822" alt="image" src="https://github.com/user-attachments/assets/223e953b-a000-4d48-b28b-aaf18e21112a" />
   <img width="1538" height="939" alt="image" src="https://github.com/user-attachments/assets/496b53e7-6f19-4989-b9d6-4d456e7968b0" />

* **Authentication**: Every request must include `projectId` + `apiKey`.
* **Operations**: `create`, `read`, `update`, `delete`.
* **Error Handling**: Structured JSON with `errorCode`, `message`, and `details`.
* **Schema Sync**: Endpoints auto-sync on schema changes.

---

## ✅ Roadmap / Next Features

### 1. Convex → Real-Time Dashboard(Done)

* Live usage stats (req count, response times)
* Instant schema change notifications
* Collaborative dashboards

### 2. Better-Auth → Advanced RBAC

* Team roles: Admin, Developer, Viewer
* OAuth provider integrations (Google, GitHub, Discord, Twitter)
* Granular API key permissions

### 3. Firecrawl → Docs Scraping

* Scrape external docs for chatbot grounding
* AI-driven contextual assistant

### 4. Scorecard → API Monitoring

* Latency, error rate, uptime
* Project reliability via **Dbify Health Score**

### 5. Inkeep → AI Docs + Smart Search

* Auto-generated interactive API docs
* Semantic search for instant examples

### 6. Vapi + Resend → Voice + Email APIs

* Voice-triggered CRUD operations
* Email confirmation with results
