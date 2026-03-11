import { useState, useEffect, useCallback, useRef } from "react";

function readParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    url: params.get("endpoint") ?? "",
    path: params.get("path") ?? "",
  };
}

function buildSearch(url: string, path: string): string {
  if (!url) return "/";
  const params = new URLSearchParams();
  params.set("endpoint", url);
  if (path) params.set("path", path);
  return "/?" + params.toString();
}

export function useUrlState() {
  const [state, setState] = useState(readParams);
  const handlingPopState = useRef(false);

  useEffect(() => {
    function onPopState() {
      handlingPopState.current = true;
      setState(readParams());
      handlingPopState.current = false;
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const setUrl = useCallback((url: string) => {
    const search = buildSearch(url, "");
    window.history.pushState({}, "", search);
    setState({ url, path: "" });
  }, []);

  const setPath = useCallback(
    (path: string, replace?: boolean) => {
      if (handlingPopState.current) return;
      const search = buildSearch(state.url, path);
      if (replace) {
        window.history.replaceState({}, "", search);
      } else {
        window.history.pushState({}, "", search);
      }
      setState((prev) => ({ ...prev, path }));
    },
    [state.url]
  );

  return { url: state.url, path: state.path, setUrl, setPath };
}
