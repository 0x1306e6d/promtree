BINARY := promtree
PLATFORMS := linux-amd64 linux-arm64 darwin-amd64 darwin-arm64

.PHONY: build dev dev-backend dev-web test clean release-artifacts

build: web/dist/index.html
	go build -o $(BINARY) ./cmd/promtree

web/dist/index.html: web/package.json $(shell find web/src -type f 2>/dev/null) web/index.html web/vite.config.ts web/tsconfig.json
	cd web && npm ci --registry https://registry.npmjs.org && npm run build

dev:
	@mkdir -p web/dist && [ -f web/dist/index.html ] || echo '<!doctype html>' > web/dist/index.html
	@trap 'kill 0' EXIT; \
	$(MAKE) dev-backend & \
	$(MAKE) dev-web & \
	wait

dev-backend:
	go run ./cmd/promtree

dev-web:
	cd web && npm install && npm run dev

test:
	go test ./...

clean:
	rm -f $(BINARY)
	rm -rf web/dist
	rm -rf dist

release-artifacts: web/dist/index.html
	@for platform in $(PLATFORMS); do \
		os=$${platform%%-*}; \
		arch=$${platform##*-}; \
		echo "Building $$os/$$arch..."; \
		CGO_ENABLED=0 GOOS=$$os GOARCH=$$arch go build -o dist/$(BINARY)-$$os-$$arch/$(BINARY) ./cmd/promtree && \
		tar -czf dist/$(BINARY)-$$os-$$arch.tar.gz -C dist/$(BINARY)-$$os-$$arch $(BINARY) && \
		rm -rf dist/$(BINARY)-$$os-$$arch; \
	done
