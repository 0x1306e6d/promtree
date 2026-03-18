package prometheus

// MetricType represents a Prometheus metric type.
type MetricType string

const (
	Counter   MetricType = "counter"
	Gauge     MetricType = "gauge"
	Histogram MetricType = "histogram"
	Summary   MetricType = "summary"
	Unknown   MetricType = ""
)

// MaxSamples caps the Samples slice to prevent payload explosion.
const MaxSamples = 100

// Meter represents a parsed Prometheus metric with its metadata and sample count.
type Meter struct {
	Name        string                    `json:"name"`
	Description string                    `json:"description"`
	Type        MetricType                `json:"type"`
	Count       int                       `json:"count"`
	Labels      map[string][]string       `json:"labels,omitempty"`
	Samples     []map[string]string       `json:"samples,omitempty"`
	LabelCounts map[string]map[string]int `json:"labelCounts,omitempty"`
}
