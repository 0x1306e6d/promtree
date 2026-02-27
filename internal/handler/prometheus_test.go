package handler

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestPrometheusBadRequest(t *testing.T) {
	tests := []struct {
		name string
		url  string
	}{
		{"missing url", "/api/prometheus"},
		{"empty url", "/api/prometheus?url="},
		{"invalid url", "/api/prometheus?url=not-a-url"},
		{"ftp scheme", "/api/prometheus?url=ftp://example.com"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodGet, tt.url, nil)
			w := httptest.NewRecorder()
			Prometheus(w, req)

			if w.Code != http.StatusBadRequest {
				t.Errorf("expected 400, got %d", w.Code)
			}
		})
	}
}

func TestPrometheusSuccess(t *testing.T) {
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(`# HELP test_metric A test metric.
# TYPE test_metric counter
test_metric{label="a"} 1
test_metric{label="b"} 2
`))
	}))
	defer upstream.Close()

	req := httptest.NewRequest(http.MethodGet, "/api/prometheus?url="+upstream.URL, nil)
	w := httptest.NewRecorder()
	Prometheus(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", w.Code, w.Body.String())
	}

	contentType := w.Header().Get("Content-Type")
	if contentType != "application/json" {
		t.Errorf("expected Content-Type application/json, got %q", contentType)
	}
}

func TestPrometheusUpstreamError(t *testing.T) {
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusServiceUnavailable)
		w.Write([]byte("service unavailable"))
	}))
	defer upstream.Close()

	req := httptest.NewRequest(http.MethodGet, "/api/prometheus?url="+upstream.URL, nil)
	w := httptest.NewRecorder()
	Prometheus(w, req)

	if w.Code != http.StatusServiceUnavailable {
		t.Errorf("expected 503, got %d", w.Code)
	}
}
