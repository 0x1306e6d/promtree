package prometheus

import (
	"fmt"
	"reflect"
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
		labels      map[string][]string
		samples     []map[string]string
		labelCounts map[string]map[string]int
	}{
		{
			"http_request_duration_seconds",
			"A histogram of the request duration.",
			Histogram, 1, nil, nil, nil,
		},
		{
			"http_requests_total",
			"The total number of HTTP requests.",
			Counter, 2,
			map[string][]string{"code": {"200", "400"}, "method": {"post"}},
			[]map[string]string{
				{"method": "post", "code": "200"},
				{"method": "post", "code": "400"},
			},
			map[string]map[string]int{
				"method": {"post": 2},
				"code":   {"200": 1, "400": 1},
			},
		},
		{
			"node_cpu_seconds_total",
			"Seconds the CPUs spent in each mode.",
			Gauge, 2,
			map[string][]string{"cpu": {"0"}, "mode": {"idle", "system"}},
			[]map[string]string{
				{"cpu": "0", "mode": "idle"},
				{"cpu": "0", "mode": "system"},
			},
			map[string]map[string]int{
				"cpu":  {"0": 2},
				"mode": {"idle": 1, "system": 1},
			},
		},
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
		if !reflect.DeepEqual(m.Labels, tt.labels) {
			t.Errorf("meter[%d]: expected labels %v, got %v", i, tt.labels, m.Labels)
		}
		if !reflect.DeepEqual(m.LabelCounts, tt.labelCounts) {
			t.Errorf("meter[%d]: expected labelCounts %v, got %v", i, tt.labelCounts, m.LabelCounts)
		}
		if tt.samples == nil {
			if m.Samples != nil {
				t.Errorf("meter[%d]: expected nil samples, got %v", i, m.Samples)
			}
		} else {
			if len(m.Samples) != len(tt.samples) {
				t.Errorf("meter[%d]: expected %d samples, got %d", i, len(tt.samples), len(m.Samples))
			} else {
				for j, expected := range tt.samples {
					if !reflect.DeepEqual(m.Samples[j], expected) {
						t.Errorf("meter[%d] sample[%d]: expected %v, got %v", i, j, expected, m.Samples[j])
					}
				}
			}
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

func TestParseSamplesCap(t *testing.T) {
	total := MaxSamples + 10
	input := "# HELP test_metric A test metric.\n# TYPE test_metric gauge\n"
	for i := 0; i < total; i++ {
		input += fmt.Sprintf("test_metric{id=\"%d\"} %d\n", i, i)
	}

	meters, err := Parse(input)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(meters) != 1 {
		t.Fatalf("expected 1 meter, got %d", len(meters))
	}

	m := meters[0]
	if len(m.Samples) != MaxSamples {
		t.Errorf("expected samples capped at %d, got %d", MaxSamples, len(m.Samples))
	}
	if len(m.LabelCounts["id"]) != total {
		t.Errorf("expected labelCounts to have all %d values, got %d", total, len(m.LabelCounts["id"]))
	}
	if len(m.Labels["id"]) != total {
		t.Errorf("expected labels to have all %d values, got %d", total, len(m.Labels["id"]))
	}
}
