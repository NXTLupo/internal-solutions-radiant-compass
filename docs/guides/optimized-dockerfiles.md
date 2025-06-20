# Optimized Dockerfile Templates

This guide provides optimized Dockerfile templates for Python 3.10 applications and React frontend applications. These templates follow best practices for creating lightweight, secure, and production-ready container images.

## Python 3.10 Application Dockerfiles

### Using Poetry (Recommended)

```dockerfile
# ---- Base Python Image ----
FROM python:3.10-slim AS base

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    POETRY_VERSION=1.4.2 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_IN_PROJECT=false \
    POETRY_NO_INTERACTION=1

# Set working directory
WORKDIR /app

# ---- Dependencies ----
FROM base AS dependencies

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="${POETRY_HOME}/bin:$PATH"

# Copy poetry configuration files
COPY pyproject.toml poetry.lock* ./

# Install dependencies
RUN poetry export -f requirements.txt > requirements.txt && \
    pip install --no-cache-dir -r requirements.txt

# ---- Runtime ----
FROM base AS runtime

# Copy Python dependencies from dependencies stage
COPY --from=dependencies /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=dependencies /usr/local/bin /usr/local/bin

# Copy application code
COPY . .

# Run as non-root user for better security
RUN adduser --disabled-password --gecos "" appuser && \
    chown -R appuser:appuser /app
USER appuser

# Run the application
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Using Requirements.txt and Pip

```dockerfile
# ---- Base Python Image ----
FROM python:3.10-slim AS base

# Set environment variables to optimize Python in Docker
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Set working directory
WORKDIR /app

# ---- Dependencies ----
FROM base AS dependencies

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# ---- Runtime ----
FROM base AS runtime

# Copy Python dependencies from dependencies stage
COPY --from=dependencies /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=dependencies /usr/local/bin /usr/local/bin

# Copy application code
COPY . .

# Run as non-root user for better security
RUN adduser --disabled-password --gecos "" appuser && \
    chown -R appuser:appuser /app
USER appuser

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Run the application
EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "app.main:app"]
```

### Simple Single-Stage Dockerfile

For simpler applications, you can use this more straightforward approach:

```dockerfile
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Run as non-root user for security
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Run the application
EXPOSE 8000
CMD ["python", "-m", "app.main"]
```

### Explanation: Multi-Stage Requirements.txt Approach

1. **Base Image**:
   - Uses the official Python 3.10 slim image to reduce size
   - Sets environment variables to optimize Python behavior in containers

2. **Multi-Stage Build**:
   - Dependencies stage: Installs build tools and Python dependencies
   - Runtime stage: Creates a clean image with only the necessary files

3. **Dependency Management**:
   - Uses a standard requirements.txt file for dependency installation
   - Installs only the required build tools for compiling dependencies

4. **Security Enhancements**:
   - Runs the application as a non-root user
   - Minimizes installed system packages
   - Includes a health check to ensure the application is running properly

5. **Production Setup**:
   - Uses Gunicorn with Uvicorn workers for a production-grade ASGI server
   - Configures multiple workers based on available CPU cores

## React Application Dockerfile

### Base Dockerfile Template

```dockerfile
# ---- Build Stage ----
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy application code
COPY . .

# Build the application
RUN npm run build

# ---- Production Stage ----
FROM nginx:alpine AS production

# Copy built assets from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx configuration if needed
# COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
```

### Explanation

1. **Multi-Stage Build**:
   - Build stage: Uses Node.js to build the React application
   - Production stage: Uses Nginx to serve static files

2. **Dependency Management**:
   - Uses `npm ci` instead of `npm install` for deterministic builds
   - Copies package files before the rest of the code to leverage Docker's layer caching

3. **Optimization Techniques**:
   - Alpine-based images for minimal size
   - Only copies the built assets to the production image
   - Separates build tools from the runtime environment

4. **Production Enhancements**:
   - Includes a health check to ensure the container is functioning
   - Uses Nginx for efficient static file serving

## Combined Setup with Docker Compose

For projects that use both Python backend and React frontend, use this docker-compose.yml example:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/app
    ports:
      - "8000:8000"
    depends_on:
      - db
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=app
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d app"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

## Best Practices

### General Docker Best Practices

1. **Use specific version tags** instead of `latest` to ensure build reproducibility
2. **Minimize the number of layers** by combining related commands
3. **Don't install unnecessary packages** to reduce image size and attack surface
4. **Use multi-stage builds** to separate build dependencies from runtime dependencies
5. **Set appropriate health checks** to ensure proper container monitoring

### Python-Specific Best Practices

1. **Use a requirements.txt file** with pinned versions for deterministic builds
2. **Set the PYTHONUNBUFFERED environment variable** to ensure logs are output immediately
3. **Consider using Gunicorn with Uvicorn** for production-grade ASGI server setup
4. **Implement proper logging configuration** for containerized environments

### React-Specific Best Practices

1. **Use environment variables** for configuration with appropriate defaults
2. **Implement proper caching strategies** in Nginx for static assets
3. **Configure proper Content Security Policy headers** in Nginx
4. **Consider using a CDN** for static assets in production

## Additional Considerations

### Environment Configuration

For both Python and React applications, use environment variables for configuration:

```dockerfile
# Python Dockerfile additional line
ENV APP_ENV=production

# React build stage additional line
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
```

### Production Optimizations

For production environments, consider these additional optimizations:

1. **Enable Nginx compression** for text-based assets
2. **Configure appropriate caching headers** for static assets
3. **Implement rate limiting** for API endpoints
4. **Use a process manager** like Supervisord for Python applications with multiple workers
5. **Configure proper logging and monitoring**

### Security Considerations

Always follow these security practices:

1. **Don't store secrets in Dockerfiles** - use environment variables or secrets management
3. **Use non-root users** in your containers whenever possible
4. **Keep base images updated** to patch security vulnerabilities