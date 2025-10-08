# Makefile for easy Docker management

.PHONY: help dev prod dev-build prod-build dev-up dev-down prod-up prod-down dev-logs prod-logs dev-shell prod-shell clean

# Default target
help:
	@echo "Available commands:"
	@echo "  dev          - Start development environment"
	@echo "  prod         - Start production environment"
	@echo "  dev-build    - Build development images"
	@echo "  prod-build   - Build production images"
	@echo "  dev-up       - Start development services"
	@echo "  dev-down     - Stop development services"
	@echo "  prod-up      - Start production services"
	@echo "  prod-down    - Stop production services"
	@echo "  dev-logs     - Show development logs"
	@echo "  prod-logs    - Show production logs"
	@echo "  dev-shell    - Open shell in development container"
	@echo "  prod-shell   - Open shell in production container"
	@echo "  clean        - Clean up containers and volumes"

# Development commands
dev: dev-up

dev-build:
	docker-compose build

dev-up:
	docker-compose up -d

dev-down:
	docker-compose down

dev-logs:
	docker-compose logs -f app

dev-shell:
	docker-compose exec app bash

# Production commands
prod: prod-up

prod-build:
	docker-compose -f docker-compose.prod.yaml build

prod-up:
	docker-compose -f docker-compose.prod.yaml up -d

prod-down:
	docker-compose -f docker-compose.prod.yaml down

prod-logs:
	docker-compose -f docker-compose.prod.yaml logs -f app

prod-shell:
	docker-compose -f docker-compose.prod.yaml exec app bash

# Cleanup
clean:
	docker-compose down -v
	docker-compose -f docker-compose.prod.yaml down -v
	docker system prune -f

# Development with tools (pgAdmin)
dev-tools:
	docker-compose --profile tools up -d

# Production with nginx
prod-nginx:
	docker-compose -f docker-compose.prod.yaml --profile nginx up -d
