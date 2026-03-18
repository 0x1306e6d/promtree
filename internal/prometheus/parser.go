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
		labels, samples, labelCounts := extractLabelInfo(family.GetMetric(), mtype)

		meters = append(meters, Meter{
			Name:        name,
			Description: family.GetHelp(),
			Type:        mtype,
			Count:       len(family.GetMetric()),
			Labels:      labels,
			Samples:     samples,
			LabelCounts: labelCounts,
		})
	}
	return meters, nil
}

func extractLabelInfo(metrics []*dto.Metric, mtype MetricType) (map[string][]string, []map[string]string, map[string]map[string]int) {
	unique := make(map[string]map[string]struct{})
	counts := make(map[string]map[string]int)
	var sampleList []map[string]string

	for _, m := range metrics {
		sample := make(map[string]string)
		for _, lp := range m.GetLabel() {
			name := lp.GetName()
			if mtype == Histogram && name == "le" {
				continue
			}
			if mtype == Summary && name == "quantile" {
				continue
			}
			value := lp.GetValue()
			sample[name] = value
			if unique[name] == nil {
				unique[name] = make(map[string]struct{})
				counts[name] = make(map[string]int)
			}
			unique[name][value] = struct{}{}
			counts[name][value]++
		}
		if len(sample) > 0 && len(sampleList) < MaxSamples {
			sampleList = append(sampleList, sample)
		}
	}
	if len(unique) == 0 {
		return nil, nil, nil
	}
	labels := make(map[string][]string, len(unique))
	for k, vs := range unique {
		vals := make([]string, 0, len(vs))
		for v := range vs {
			vals = append(vals, v)
		}
		sort.Strings(vals)
		labels[k] = vals
	}
	return labels, sampleList, counts
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
