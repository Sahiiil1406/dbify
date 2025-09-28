# Dbify

Tired of dealing with database connections, boilerplate code, and fragile APIs? Dbify instantly turns your database into a production-ready, auto-scaling API—no server setup. Perfect for prototypes, internal tools, or enterprise apps. Fully documented APIs, real-time analytics, and secure access let you focus on building your product, not infrastructure.

🌐 **One Platform, Every Database** – Works across SQL, NoSQL, Graph, Vector, and reactive databases (currently supports PostgreSQL & MongoDB).

✅ **Your data, your rules** – Dbify never replicates or moves your data. Zero vendor lock-in. Full control.

---

## 🚀 Features

* ⚡ **Instant CRUD API** – Auto-generate RESTful APIs for all tables/collections in seconds.
* 📊 **Realtime Dashboard** – Track usage, schema history & live logs.
* 🔍 **Schema Change Detection** – Auto-refresh cache + instant alerts.
* 📈 **Scalability & Performance** – PgBouncer pooling + async workers + realtime analytics (Convex).
* 🔐 **Secure Authentication** – Social logins, RBAC, and API key management.
* 📢 **Smart Notifications** – Alerts for schema updates, spikes & team activity.
* 🔎 **Advanced Queries & Search** – SQL/NoSQL builder, full-text + semantic vector search.
* 👨‍💻 **Developer Friendly** – Auto API docs, CLI, SDKs & built-in linter.
* 🤖 **AI-Powered Docs (Inkeep)** – Conversational agent + Firecrawl-scraped docs + semantic search.

---

## 📐 System Architecture
<!-- <img width="5196" height="2965" alt="dbify" src="https://github.com/user-attachments/assets/3bfca9cb-a87f-4920-9159-6166cba77a67" /> -->
<img width="6040" height="3205" alt="image" src="https://github.com/user-attachments/assets/ce1dd40c-954b-4f56-becf-e11cb51a27e7" />

### High-Level Flow

1. User provides DB connection → **Dbify Server** validates, returns `apiKey` & `projectId`, caches schema.
2. Schema changes auto-update cache + notify users.
3. Logs pushed to queue, processed by workers, stored in **ClickHouse**.
4. Dashboard shows real-time usage, analytics & schema events.

### Subsystems

* **Auth**: Better-Auth for RBAC + secure keys.
* **Notifications**: Resend for alerts & team invites.
* **Analytics**: Convex (real-time) + ClickHouse (historical).
* **Scaling**: Redis cache + PgBouncer pooling.

---

## 📊 Tech Stack

* **Backend**: Node.js / Express
* **Primary DB**: PostgreSQL
* **Analytics**: Convex + ClickHouse
* **Queue**: RabbitMQ
* **Workers**: Node.js
* **Search**: Elasticsearch, ChromaDB (Vector DB)
* **Cache**: Redis
* **Connection Management**: PgBouncer
* **Notifications**: Resend
* **Auth**: Better-Auth
* **Scraping**: Firecrawl
* **AI Agent**: Inkeep, OpenAI

---

## 🚀 Quick Start & Documentation

1. **Provide your DB connection URL:**

   ```bash
   postgres://username:password@host:5432/mydb
   ```

2. **Dbify instantly generates**: `projectId`, `apiKey`, and ready-to-use CRUD endpoints.

---

### 🔑 Authentication

Include `projectId` + `apiKey` in every request header or payload.

---

### ⚡ Supported Operations

* **Ops**: `create`, `read`, `update`, `delete`
* **Errors**: JSON with `errorCode`, `message`, `details`
* **Schema Sync**: Endpoints auto-refresh on schema changes

---
<img width="1854" height="936" alt="docs1" src="https://github.com/user-attachments/assets/a61b8bc1-f568-453b-ae06-bb8852ab6fa4" />

<img width="1552" height="822" alt="docs2" src="https://github.com/user-attachments/assets/223e953b-a000-4d48-b28b-aaf18e21112a" />

<img width="1538" height="939" alt="docs3" src="https://github.com/user-attachments/assets/496b53e7-6f19-4989-b9d6-4d456e7968b0" />

### 📘 Example API Usage

#### Read

```json
{
  "projectId": 4,
  "apiKey": "4148f85d8ae6a3914f",
  "operation": "read",
  "payload": { "id": 3 },
  "tableName": "Project"
}
```

#### Update

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

#### Create

```json
{
  "projectId": 4,
  "apiKey": "4148f85d8ae6a3914f",
  "operation": "create",
  "payload": { "data": { "title": "New Project", "description": "This is a new project" } },
  "tableName": "Project"
}
```

#### Delete

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

### 🌐 Example cURL

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


## ✅ Roadmap

1. 🌍 Multi-database expansion (MySQL, DynamoDB, Neo4j, etc.)
2. 🤖 AI Agent for automated API testing
3. 🎙️ Voice assistant integration for dev workflows
4. 📦 Client SDKs in multiple languages for faster adoption
