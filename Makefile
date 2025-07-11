# Ecotunga Backend Makefile

.PHONY: help start stop restart logs migrate seed backend mysql status cleanup dev-start dev-stop dev-restart dev-logs dev-migrate dev-seed dev-backend dev-mysql dev-status dev-cleanup

# Default target
help:
	@echo "Ecotunga Backend Docker Management"
	@echo ""
	@echo "Production Commands:"
	@echo "  make start          Start production services"
	@echo "  make stop           Stop production services"
	@echo "  make restart        Restart production services"
	@echo "  make logs           View backend logs"
	@echo "  make migrate        Run database migrations"
	@echo "  make seed           Run database seeds"
	@echo "  make backend        Access backend container"
	@echo "  make mysql          Access MySQL database"
	@echo "  make status         Show service status"
	@echo "  make cleanup        Remove all containers and volumes"
	@echo ""
	@echo "Development Commands:"
	@echo "  make dev-start      Start development services"
	@echo "  make dev-stop       Stop development services"
	@echo "  make dev-restart    Restart development services"
	@echo "  make dev-logs       View backend logs (dev)"
	@echo "  make dev-migrate    Run database migrations (dev)"
	@echo "  make dev-seed       Run database seeds (dev)"
	@echo "  make dev-backend    Access backend container (dev)"
	@echo "  make dev-mysql      Access MySQL database (dev)"
	@echo "  make dev-status     Show service status (dev)"
	@echo "  make dev-cleanup    Remove all containers and volumes (dev)"
	@echo ""
	@echo "Setup:"
	@echo "  make setup          Initial setup (copy env file)"
	@echo "  make build          Build production image"
	@echo "  make build-dev      Build development image"

# Setup
setup:
	@if [ ! -f .env ]; then \
		if [ -f env.example ]; then \
			cp env.example .env; \
			echo "✅ .env file created from template. Please edit it with your configuration."; \
		else \
			echo "❌ env.example file not found. Please create a .env file manually."; \
			exit 1; \
		fi; \
	else \
		echo "✅ .env file already exists."; \
	fi

# Production commands
start: setup
	docker-compose up --build -d

stop:
	docker-compose down

restart: stop start

logs:
	docker-compose logs -f backend

migrate:
	docker-compose exec backend npm run migrate

seed:
	docker-compose exec backend npm run seed

backend:
	docker-compose exec backend sh

mysql:
	docker-compose exec mysql mysql -u ecotunga_user -p ecotunga

status:
	docker-compose ps

cleanup:
	docker-compose down -v --remove-orphans

build:
	docker-compose build

# Development commands
dev-start: setup
	docker-compose -f docker-compose.dev.yml up --build -d

dev-stop:
	docker-compose -f docker-compose.dev.yml down

dev-restart: dev-stop dev-start

dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f backend

dev-migrate:
	docker-compose -f docker-compose.dev.yml exec backend npm run migrate

dev-seed:
	docker-compose -f docker-compose.dev.yml exec backend npm run seed

dev-backend:
	docker-compose -f docker-compose.dev.yml exec backend sh

dev-mysql:
	docker-compose -f docker-compose.dev.yml exec mysql mysql -u ecotunga_user -p ecotunga

dev-status:
	docker-compose -f docker-compose.dev.yml ps

dev-cleanup:
	docker-compose -f docker-compose.dev.yml down -v --remove-orphans

build-dev:
	docker-compose -f docker-compose.dev.yml build 