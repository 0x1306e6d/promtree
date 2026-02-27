package prometheus

import (
	"sort"
	"testing"
)

const sampleMetrics = `# HELP http_requests_total The total number of HTTP requests.
# TYPE http_requests_total counter
http_requests_total{method="post",code="200"} 1027
http_requests_total{method="post",code="400"} 3
# HELP http_request_duration_seconds A histogram of the request duration.
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.05"} 24054
http_request_duration_seconds_bucket{le="0.1"} 33444
http_request_duration_seconds_bucket{le="+Inf"} 144320
http_request_duration_seconds_sum 53423
http_request_duration_seconds_count 144320
# HELP node_cpu_seconds_total Seconds the CPUs spent in each mode.
# TYPE node_cpu_seconds_total gauge
node_cpu_seconds_total{cpu="0",mode="idle"} 362882.51
node_cpu_seconds_total{cpu="0",mode="system"} 4588.28
`

func TestParse(t *testing.T) {
	meters, err := Parse(sampleMetrics)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if len(meters) != 3 {
		t.Fatalf("expected 3 meters, got %d", len(meters))
	}

	sort.Slice(meters, func(i, j int) bool {
		return meters[i].Name < meters[j].Name
	})

	tests := []struct {
		name        string
		description string
		metricType  MetricType
		count       int
	}{
		{"http_request_duration_seconds", "A histogram of the request duration.", Histogram, 1},
		{"http_requests_total", "The total number of HTTP requests.", Counter, 2},
		{"node_cpu_seconds_total", "Seconds the CPUs spent in each mode.", Gauge, 2},
	}

	for i, tt := range tests {
		m := meters[i]
		if m.Name != tt.name {
			t.Errorf("meter[%d]: expected name %q, got %q", i, tt.name, m.Name)
		}
		if m.Description != tt.description {
			t.Errorf("meter[%d]: expected description %q, got %q", i, tt.description, m.Description)
		}
		if m.Type != tt.metricType {
			t.Errorf("meter[%d]: expected type %q, got %q", i, tt.metricType, m.Type)
		}
		if m.Count != tt.count {
			t.Errorf("meter[%d]: expected count %d, got %d", i, tt.count, m.Count)
		}
	}
}

func TestParseEmpty(t *testing.T) {
	meters, err := Parse("")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(meters) != 0 {
		t.Fatalf("expected 0 meters, got %d", len(meters))
	}
}
