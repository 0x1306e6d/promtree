# promtree

A web application that visualizes Prometheus metrics as an interactive navigable tree.

Enter a Prometheus exporter URL, and promtree fetches the metrics, parses the text format, builds a tree by splitting metric names on `_`, and renders a breadcrumb-navigable explorer.

## Quick start

```sh
make build
./promtree --port 8080
```

Open http://localhost:8080 and enter a Prometheus metrics URL.

## Development

Run the Go backend and Vite dev server separately:

```sh
make dev-backend   # Go server on :8080
make dev-frontend  # Vite dev server with proxy to :8080
```

## Docker

```sh
docker build -t promtree .
docker run -p 8080:8080 promtree
```

## Testing

```sh
make test
```

## License

[MIT](LICENSE)
