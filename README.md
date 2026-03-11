Node-DevOps Project

This repository demonstrates a **Dockerized Node.js application** deployed on **AWS EC2** using **Terraform** and **CI/CD with GitHub Actions**. It includes a **PostgreSQL database container** and three endpoints (`/health`, `/status`, `/process`) to verify functionality.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [AWS Deployment with Terraform](#aws-deployment-with-terraform)
- [Docker Endpoints](#docker-endpoints)
- [CI/CD Workflow](#cicd-workflow)
- [Key Decisions](#key-decisions)
- [Notes](#notes)
- [Access](#access)

---

## Project Overview
- **Application**: Node.js REST API
- **Containerization**: Docker + docker-compose
- **Database**: PostgreSQL (Docker container)
- **Infrastructure as Code**: Terraform (EC2, Security Group, VPC)
- **CI/CD**: GitHub Actions builds and pushes Docker images
- **Health Check**: `/health` endpoint confirms app + DB connectivity
- **Additional Endpoints**: `/status` for app metadata, `/process` for demo POST task

---

## Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Terraform](https://www.terraform.io/downloads.html)
- AWS account with IAM credentials (for Terraform)
- Optional: GitHub account and Personal Access Token for CI/CD secrets

---

## Local Development

1. Clone the repository:

```bash
git clone https://github.com/baalebos-cloud/node-devops-project.git
cd node-devops-project
````

2. Create a `.env` file (or set environment variables) for database credentials:

```env
DB_HOST=localhost
DB_USER=*****
DB_PASSWORD=*****
DB_NAME=appdb
DB_PORT=5432
PORT=3000
```

3. Build and start containers:

```bash
docker-compose up --build
```

4. Verify endpoints:

```bash
# Health check
curl http://localhost:3000/health

# Status
curl http://localhost:3000/status

# Process a task
curl -X POST http://localhost:3000/process \
-H "Content-Type: application/json" \
-d '{"task":"demo"}'
```

Expected `/health` response:

```json
{
  "status": "OK",
  "database": "connected",
  "timestamp": "2026-03-11T19:33:48.711Z"
}
```

---

## AWS Deployment with Terraform

1. Navigate to the Terraform folder:

```bash
cd terraform
terraform init
terraform apply
```

2. After applying, note the EC2 public IP:

```bash
terraform output instance_ip
```

3. Access the application on your EC2 instance:

```bash
http://34.234.234.97:3000/health
http://34.234.234.97:3000/status
```

> Note: `/process` also works with `POST` requests.


## Docker Endpoints

| Endpoint   | Method | Description                                |
| ---------- | ------ | ------------------------------------------ |
| `/health`  | GET    | Verifies app and DB connectivity           |
| `/status`  | GET    | Returns app metadata (uptime, environment) |
| `/process` | POST   | Demo endpoint to process tasks             |

Example POST request:

```bash
curl -X POST http://localhost:3000/process \
-H "Content-Type: application/json" \
-d '{"task":"demo"}'
```

Response:

```json
{
  "message": "Task 'demo' processed successfully",
  "processed_at": "2026-03-11T19:34:01.433Z"
}
```

## CI/CD Workflow

Workflow file: `.github/workflows/docker-build.yml`
Triggered on:

* Push to `main`
* Pull request to `main`

Steps:

1. Checkout code
2. Set up Docker Buildx
3. Log in to Docker Hub (secrets: * & *)
4. Build and push Docker image
5. Optional health check for container

---

## Key Decisions

* EC2 instance only: Simplified for assessment; no ALB required.
* HTTP endpoint: No ACM certificate or real domain required for demo.
* Docker non-root: Ensures container security.
* Health endpoint: Verifies DB connection and app readiness.
* Terraform: Infrastructure is reproducible and automated.
* Endpoints: Added `/status` and `/process` for additional demo functionality.

---

## Notes

* Demonstrates containerized application deployment.
* Infrastructure as code using Terraform.
* CI/CD automation with GitHub Actions.
* Basic security and observability best practices.


## Access

* EC2 Public IP example:

```text
http://34.234.234.97:3000/health
http://34.234.234.97:3000/status
```

* `/process` requires POST request with JSON body.
