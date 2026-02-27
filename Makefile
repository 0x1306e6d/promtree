.PHONY: build dev-backend dev-web test clean

build: web/dist/index.html
	go build -o promtree ./cmd/promtree

web/dist/index.html: web/package.json $(shell find web/src -type f 2>/dev/null) web/index.html web/vite.config.ts web/tsconfig.json
	cd web && npm ci --registry https://registry.npmjs.org && npm run build

dev-backend:
	go run ./cmd/promtree

dev-web:
	cd web && npm run dev

test:
	go test ./...

clean:
	rm -f promtree
	rm -rf web/dist
