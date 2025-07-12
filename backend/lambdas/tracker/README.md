# Lambda for article tracker

This lambda fetches the latest articles that were tracked using the pocket API.

# How to Run Locally with Docker Compose

This project is configured to run locally using Docker Compose, which provides a secure and efficient testing environment.

### Prerequisites
- Docker and Docker Compose installed.
- A `.env` file created from the template. To set it up, run the following command and then fill in the values:
  ```bash
  cp env.template .env
  ```

### 1. Build and Run the Container
To start the Lambda function in a detached mode, run the following command from this directory (`backend/lambdas/tracker`):
```bash
docker-compose up --build -d
```

### 2. Invoke the Lambda
Once the container is running (give it a few seconds to initialize), use this command to test the function:
```bash
curl "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'
```

### 3. View Logs
To see the real-time output and logs from your function, run:
```bash
docker-compose logs -f
```

### 4. Stop the Container
When you're finished, stop the service with:
```bash
docker-compose down
```

# Running Unit Tests

To run the Jest unit tests, a dedicated `test` service has been configured in the `docker-compose.yml` file. This service overrides the default Lambda entrypoint to run `npm test` directly.

Use the following command to build the image if necessary and run the tests. The `--rm` flag will automatically remove the container after the test run is complete.

```bash
docker-compose run --rm test
```
