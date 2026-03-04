package prometheus

import (
	"fmt"
	"sort"
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
		mtype := convertType(family.GetType())
		labels := extractLabels(family.GetMetric(), mtype)

		meters = append(meters, Meter{
			Name:        name,
			Description: family.GetHelp(),
			Type:        mtype,
			Count:       len(family.GetMetric()),
			Labels:      labels,
		})
	}
	return meters, nil
}

func extractLabels(metrics []*dto.Metric, mtype MetricType) map[string][]string {
	unique := make(map[string]map[string]struct{})
	for _, m := range metrics {
		for _, lp := range m.GetLabel() {
			name := lp.GetName()
			if mtype == Histogram && name == "le" {
				continue
			}
			if mtype == Summary && name == "quantile" {
				continue
			}
			if unique[name] == nil {
				unique[name] = make(map[string]struct{})
			}
			unique[name][lp.GetValue()] = struct{}{}
		}
	}
	if len(unique) == 0 {
		return nil
	}
	result := make(map[string][]string, len(unique))
	for k, vs := range unique {
		vals := make([]string, 0, len(vs))
		for v := range vs {
			vals = append(vals, v)
		}
		sort.Strings(vals)
		result[k] = vals
	}
	return result
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
