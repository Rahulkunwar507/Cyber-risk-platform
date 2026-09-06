import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Tiny data-loading hook used by every page.
 * `loader` is any async function from the service layer (e.g. getDashboard()).
 * On mount (and whenever `deps` change) it runs the loader and exposes
 * { data, loading, error, refetch } — the standard API-readiness contract
 * so pages never change when the loader is swapped for a real fetch().
 */
export function useLoad(loader, deps = []) {
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const [state, setState] = useState({ data: null, loading: true, error: null });

  const run = useCallback(() => {
    setState({ data: null, loading: true, error: null });
    Promise.resolve(loaderRef.current())
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => setState({ data: null, loading: false, error: error?.message || 'Something went wrong.' }));
  }, []);

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, refetch: run };
}
