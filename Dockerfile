# Stage 1: Build frontend
FROM node:22-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Stage 2: Build Go binary
FROM golang:1.22-alpine AS backend
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
COPY --from=frontend /app/frontend/dist ./frontend/dist
RUN CGO_ENABLED=0 go build -o /promtree ./cmd/promtree

# Stage 3: Final image
FROM alpine:latest
RUN apk --no-cache add ca-certificates
COPY --from=backend /promtree /promtree
EXPOSE 8080
ENTRYPOINT ["/promtree"]
