# NXT Humans Internal Solutions - Docker Compose Makefile
# Essential commands for managing services

.PHONY: help up down build logs status clean health dev-setup
.PHONY: backend-shell backend-logs backend-migrate backend-migrate-create backend-test backend-lint backend-format
.PHONY: db-shell db-logs db-backup db-restore
.PHONY: frontend-logs frontend-restart frontend-shell
.PHONY: coagent-shell coagent-logs coagent-restart
.PHONY: docs-shell docs-logs docs-restart

# Default target
help: ## Show this help message
	@echo "NXT Humans Internal Solutions - Docker Compose Commands"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Infrastructure Commands
up: ## Start all services
	docker compose up -d

down: ## Stop all services
	docker compose down

build: ## Build all services
	docker compose build

logs: ## View logs from all services
	docker compose logs -f

status: ## Check status of all services
	docker compose ps

clean: ## Stop services and remove containers, networks, volumes
	docker compose down -v --remove-orphans
	docker system prune -f

health: ## Check health of all services
	@echo "Checking service health..."
	@docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

dev-setup: ## Setup development environment
	@echo "Setting up development environment..."
	@if [ ! -f .env ]; then \
		echo "Creating .env from .env.example..."; \
		cp .env.example .env; \
		echo "Please edit .env with your configuration"; \
	fi
	make build
	make up

# Backend Commands (FastAPI/Python)
backend-shell: ## Open bash shell in backend container
	docker compose exec backend bash

backend-logs: ## View backend service logs
	docker compose logs -f backend

backend-migrate: ## Run Alembic database migrations
	docker compose exec backend alembic upgrade head

backend-migrate-create: ## Create new Alembic migration (use: make backend-migrate-create MESSAGE="description")
	@if [ -z "$(MESSAGE)" ]; then \
		echo "Error: MESSAGE is required. Usage: make backend-migrate-create MESSAGE=\"your description\""; \
		exit 1; \
	fi
	docker compose exec backend alembic revision --autogenerate -m "$(MESSAGE)"

backend-test: ## Run pytest tests (creates temporary container with dev dependencies)
	docker compose run --rm -e ENVIRONMENT=test backend sh -c "pip install pytest pytest-asyncio httpx && python -m pytest"

backend-lint: ## Run linting tools (creates temporary container with dev dependencies)
	docker compose run --rm backend sh -c "pip install ruff pylint && ruff check . && pylint app/"

backend-format: ## Run code formatting (creates temporary container with dev dependencies)
	docker compose run --rm backend sh -c "pip install autoflake autopep8 ruff isort && \
		autoflake --in-place --recursive --remove-all-unused-imports . && \
		autopep8 --recursive --in-place . && \
		ruff check --fix . && \
		isort ."

# Database Commands (PostgreSQL)
db-shell: ## Open psql shell in database
	docker compose exec postgres psql -U postgres -d ai_assistant

db-logs: ## View database logs
	docker compose logs -f postgres

db-backup: ## Create database backup (use: make db-backup FILE="backup.sql")
	@if [ -z "$(FILE)" ]; then \
		FILE="backup_$$(date +%Y%m%d_%H%M%S).sql"; \
	fi; \
	echo "Creating backup: $$FILE"; \
	docker compose exec postgres pg_dump -U postgres ai_assistant > $$FILE

db-restore: ## Restore database from backup (use: make db-restore FILE="backup.sql")
	@if [ -z "$(FILE)" ]; then \
		echo "Error: FILE is required. Usage: make db-restore FILE=\"backup.sql\""; \
		exit 1; \
	fi
	@if [ ! -f "$(FILE)" ]; then \
		echo "Error: File $(FILE) does not exist"; \
		exit 1; \
	fi
	docker compose exec -T postgres psql -U postgres ai_assistant < $(FILE)

# Frontend Commands (React/Nginx)
frontend-logs: ## View frontend service logs
	docker compose logs -f frontend

frontend-restart: ## Restart frontend service
	docker compose restart frontend

frontend-shell: ## Open shell in frontend container (limited - nginx alpine)
	docker compose exec frontend sh

# CoAgent Runtime Commands (Node.js)
coagent-shell: ## Open shell in coagent-runtime container
	docker compose exec coagent-runtime sh

coagent-logs: ## View coagent-runtime service logs
	docker compose logs -f coagent-runtime

coagent-restart: ## Restart coagent-runtime service
	docker compose restart coagent-runtime

# Documentation Commands (MkDocs)
docs-shell: ## Open shell in docs container
	docker compose exec docs sh

docs-logs: ## View docs service logs
	docker compose logs -f docs

docs-restart: ## Restart docs service
	docker compose restart docs

# Development Shortcuts
dev: up ## Alias for 'up' - start all services

stop: down ## Alias for 'down' - stop all services

restart: ## Restart all services
	docker compose restart

rebuild: ## Rebuild and restart all services
	docker compose down
	docker compose build --no-cache
	docker compose up -d

# Service-specific rebuilds
rebuild-backend: ## Rebuild only backend service
	docker compose build --no-cache backend
	docker compose up -d backend

rebuild-frontend: ## Rebuild only frontend service
	docker compose build --no-cache frontend
	docker compose up -d frontend

rebuild-coagent: ## Rebuild only coagent-runtime service
	docker compose build --no-cache coagent-runtime
	docker compose up -d coagent-runtime