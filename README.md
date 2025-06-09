
# 🚀 Distributed Job Queue System with Redis and BullMQ

This project is a scalable, distributed queue system using **Node.js**, **BullMQ**, **Redis**, and **PostgreSQL** (via Prisma). It supports job submission through RESTful APIs, background job processing with workers, and job status tracking.

---

## 📌 Features

- RESTful API for job submission (e.g., welcome emails, password reset)
- BullMQ-powered queue management with Redis
- Distributed, fault-tolerant worker architecture
- Retry logic and event tracking
- Prisma + PostgreSQL integration
- Docker support
- Extendable for various use cases (file processing, data enrichment, etc.)

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/admirmif/distributed-queue-system.git
cd distributed-queue-system
```
### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file:

```bash
cp .env.example .env
```

Fill in your environment details, including:

```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://localhost:6379
```

### 4. Start Redis (Required)

You need Redis running for queues to work.

#### 5. Start with Docker Compose

```bash
docker-compose up --build
```

---

### 6. Start the Development Server

```bash
runServer.sh
```

> Make sure Redis and Postgres are running first.

---

## Notes

- Queue retry logic with exponential backoff
- Job status tracking using `QueueEvents`
- Cleanly structured: routes → controllers → services → queues
- Easily extendable for new job types

## Improvments

 - Isolate workers as standalone services in Docker Compose
 - Queue management UI (Bull board in this case)
 - Testing & CI 
 - Job status API
 - Custom error class for errors

---

## 📄 License

MIT © admirmif
