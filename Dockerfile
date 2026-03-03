# Stage 1: Build frontend
FROM node:24-alpine AS frontend
WORKDIR /app/web
COPY web/package.json web/package-lock.json ./
RUN npm ci
COPY web/ .
RUN npm run build

# Stage 2: Build Go binary
FROM golang:1.25-alpine AS backend
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
COPY --from=frontend /app/web/dist ./web/dist
RUN CGO_ENABLED=0 go build -o /promtree ./cmd/promtree

# Stage 3: Final image
FROM alpine:latest
RUN apk --no-cache add ca-certificates
COPY --from=backend /promtree /promtree
EXPOSE 8080
ENTRYPOINT ["/promtree"]
