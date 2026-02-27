package tree

import (
	"strings"

	"github.com/0x1306e6d/promtree/internal/prometheus"
)

// MeterTree is a hierarchical tree built by splitting metric names on "_".
type MeterTree struct {
	Children map[string]*MeterTree `json:"children"`
	Count    int                   `json:"count"`
	Meter    *prometheus.Meter     `json:"meter,omitempty"`
}

// Build creates a MeterTree from a slice of Meter by splitting names on "_".
func Build(meters []prometheus.Meter) *MeterTree {
	root := &MeterTree{Children: make(map[string]*MeterTree)}
	for i := range meters {
		add(root, strings.Split(meters[i].Name, "_"), &meters[i])
	}
	return root
}

func add(root *MeterTree, key []string, value *prometheus.Meter) {
	current := root
	for _, k := range key {
		current.Count += value.Count

		child, ok := current.Children[k]
		if !ok {
			child = &MeterTree{Children: make(map[string]*MeterTree)}
			current.Children[k] = child
		}
		current = child
	}
	current.Count = value.Count
	current.Meter = value
}
