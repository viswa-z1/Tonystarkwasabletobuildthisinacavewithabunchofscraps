.PHONY: up down logs build clean web mobile health install-web install-mobile

up:
	cd infra && docker compose up

down:
	cd infra && docker compose down

logs:
	cd infra && docker compose logs -f

build:
	cd infra && docker compose build

clean:
	cd infra && docker compose down -v --remove-orphans

web:
	cd apps/web && pnpm dev

mobile:
	cd apps/mobile && npx expo start

health:
	@curl -s http://localhost:8080/health | python3 -m json.tool
	@curl -s http://localhost:8000/     | python3 -m json.tool

install-web:
	cd apps/web && pnpm install

install-mobile:
	cd apps/mobile && npm install
