import { useState, useEffect, useCallback } from 'react';
import { getErrorMessage } from '../utils/errorMessage';

export function useApi(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    
    // Support AbortController if fetcher accepts it
    const controller = new AbortController();

    fetcher({ signal: controller.signal })
      .then((res) => {
        if (!ignore) {
          setData(res.data?.data ?? res.data); // Support Axios res.data and custom ApiResponse
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          // ignore cancel errors
          if (err.name !== 'CanceledError') {
             setError(getErrorMessage(err));
             setLoading(false);
          }
        }
      });

    return () => {
      ignore = true;
      controller.abort();
    };
  }, deps);

  useEffect(() => {
    return reload();
  }, [reload]);

  return { data, loading, error, reload };
}
