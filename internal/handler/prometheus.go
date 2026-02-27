package handler

import (
	"encoding/json"
	"io"
	"net/http"
	"net/url"
	"time"

	"github.com/0x1306e6d/promtree/internal/prometheus"
	"github.com/0x1306e6d/promtree/internal/tree"
)

var httpClient = &http.Client{Timeout: 10 * time.Second}

// Prometheus handles GET /api/prometheus?url=<target>.
func Prometheus(w http.ResponseWriter, r *http.Request) {
	target := r.URL.Query().Get("url")
	if target == "" {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	u, err := url.ParseRequestURI(target)
	if err != nil || (u.Scheme != "http" && u.Scheme != "https") {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	resp, err := httpClient.Get(target)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		w.WriteHeader(resp.StatusCode)
		w.Write(body)
		return
	}

	meters, err := prometheus.Parse(string(body))
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	meterTree := tree.Build(meters)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(meterTree)
}
