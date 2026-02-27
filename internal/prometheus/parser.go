package prometheus

import (
	"fmt"
	"strings"

	"github.com/prometheus/common/expfmt"
	"github.com/prometheus/common/model"

	dto "github.com/prometheus/client_model/go"
)

// Parse parses Prometheus text exposition format into a slice of Meter.
func Parse(content string) ([]Meter, error) {
	parser := expfmt.NewTextParser(model.LegacyValidation)
	families, err := parser.TextToMetricFamilies(strings.NewReader(content))
	if err != nil {
		return nil, fmt.Errorf("parsing prometheus metrics: %w", err)
	}

	meters := make([]Meter, 0, len(families))
	for name, family := range families {
		meters = append(meters, Meter{
			Name:        name,
			Description: family.GetHelp(),
			Type:        convertType(family.GetType()),
			Count:       len(family.GetMetric()),
		})
	}
	return meters, nil
}

func convertType(t dto.MetricType) MetricType {
	switch t {
	case dto.MetricType_COUNTER:
		return Counter
	case dto.MetricType_GAUGE:
		return Gauge
	case dto.MetricType_HISTOGRAM:
		return Histogram
	case dto.MetricType_SUMMARY:
		return Summary
	default:
		return Unknown
	}
}
