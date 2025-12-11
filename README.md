# Assignment_14
📦 Installation & Setup

Clone the Repository git clone git@github.com:ds2464-lang/Assignment_14.git cd Assignment_14
🖥️ Running the Frontend

The project uses a simple static HTML frontend served directly by FastAPI’s /static routes.

Start the FastAPI server: uvicorn app.main:app --reload

Then open your browser at:

http://localhost:8000

Frontend pages include:

/register

/login

/calculator

🧪 Running Playwright Tests

Playwright tests are located in:

tests/e2e/playwright/

Install Playwright Browsers playwright install

Start the FastAPI server

Playwright needs your app running.

uvicorn app.main:app --reload

Run all Playwright tests npx playwright test
Run a single test file npx playwright test tests/e2e/playwright/calculation.spec.ts

Run with UI mode npx playwright test --ui

🐳 Running with Docker

The backend includes a full Docker pipeline.

Build the image docker build -t fastapi-calculator .

Run the app docker run -p 8000:8000 fastapi-calculator

Run with docker-compose (recommended) docker compose up --build

This launches:

FastAPI backend

PostgreSQL database

🔄 CI/CD Pipeline (GitHub Actions)

The workflow automatically:

Spins up a PostgreSQL service

Installs dependencies

Runs:

Unit tests

Integration tests

Playwright E2E tests

Runs Trivy vulnerability scan

Builds & pushes Docker image to Docker Hub (only on main branch)

You can find the workflow file at:

.github/workflows/test.yml

🐋 Docker Hub Repository

The final image is published here:

https://hub.docker.com/repository/docker/domsil12/assignment14/general
