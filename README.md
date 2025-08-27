
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

---

## 📐 Architecture

Below is the high-level system architecture of Dbify:
<img width="1861" height="916" alt="image" src="https://github.com/user-attachments/assets/3188d43f-823a-4c04-8e25-2edad4ba235a" />

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
---

## 🔮 Roadmap

* [ ] OAuth & JWT authentication for APIs.
* [ ] Role-based access control (RBAC).
* [ ] Multi-tenant support.
* [ ] SDKs for JavaScript, Python, and Go.
* [ ] Webhooks for real-time notifications.

---

---

## 📜 License

MIT License
