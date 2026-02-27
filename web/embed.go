package web

import (
	"embed"
	"io/fs"
	"net/http"
	"os"
	"path"
)

//go:embed all:dist
var distFS embed.FS

// Handler returns an http.Handler that serves the embedded web frontend.
// Unmatched paths fall back to index.html for SPA routing.
func Handler() http.Handler {
	dist, err := fs.Sub(distFS, "dist")
	if err != nil {
		panic(err)
	}
	fileServer := http.FileServer(http.FS(dist))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Try to serve the file directly.
		p := path.Clean(r.URL.Path)
		if p == "/" {
			fileServer.ServeHTTP(w, r)
			return
		}
		// Check if file exists in the embedded FS.
		if _, err := fs.Stat(dist, p[1:]); os.IsNotExist(err) {
			// SPA fallback: serve index.html for unknown paths.
			r.URL.Path = "/"
			fileServer.ServeHTTP(w, r)
			return
		}
		fileServer.ServeHTTP(w, r)
	})
}
