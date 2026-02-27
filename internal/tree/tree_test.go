package tree

import (
	"testing"

	"github.com/0x1306e6d/promtree/internal/prometheus"
)

func TestBuild(t *testing.T) {
	meters := []prometheus.Meter{
		{Name: "http_request_duration", Count: 100},
		{Name: "http_request_errors", Count: 50},
		{Name: "http_connection_total", Count: 30},
	}

	root := Build(meters)

	if root.Count != 180 {
		t.Errorf("root count: expected 180, got %d", root.Count)
	}

	httpNode, ok := root.Children["http"]
	if !ok {
		t.Fatal("expected 'http' child")
	}
	if httpNode.Count != 180 {
		t.Errorf("http count: expected 180, got %d", httpNode.Count)
	}

	reqNode, ok := httpNode.Children["request"]
	if !ok {
		t.Fatal("expected 'request' child under 'http'")
	}
	if reqNode.Count != 150 {
		t.Errorf("request count: expected 150, got %d", reqNode.Count)
	}

	durNode, ok := reqNode.Children["duration"]
	if !ok {
		t.Fatal("expected 'duration' child under 'request'")
	}
	if durNode.Count != 100 {
		t.Errorf("duration count: expected 100, got %d", durNode.Count)
	}
	if durNode.Meter == nil {
		t.Fatal("expected meter on leaf 'duration'")
	}

	connNode, ok := httpNode.Children["connection"]
	if !ok {
		t.Fatal("expected 'connection' child under 'http'")
	}
	if connNode.Count != 30 {
		t.Errorf("connection count: expected 30, got %d", connNode.Count)
	}
}

func TestBuildEmpty(t *testing.T) {
	root := Build(nil)
	if root.Count != 0 {
		t.Errorf("expected 0 count, got %d", root.Count)
	}
	if len(root.Children) != 0 {
		t.Errorf("expected 0 children, got %d", len(root.Children))
	}
}
