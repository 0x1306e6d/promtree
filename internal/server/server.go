package server

import (
	"net/http"

	"github.com/0x1306e6d/promtree/internal/handler"
)

// New creates an HTTP server with all routes configured.
func New(addr string, frontendHandler http.Handler) *http.Server {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/prometheus", handler.Prometheus)
	if frontendHandler != nil {
		mux.Handle("/", frontendHandler)
	}
	return &http.Server{Addr: addr, Handler: mux}
}
