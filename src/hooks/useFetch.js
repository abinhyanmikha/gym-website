import { useState, useEffect } from "react";

export function useFetch(url, initialState = []) {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(url);
        const result = await res.json();
        
        // Handle both direct arrays and nested data (e.g. { users: [] })
        if (Array.isArray(result)) {
          setData(result);
        } else if (result && typeof result === 'object') {
          // If it's an object, check if it has a property that is an array
          const arrayKey = Object.keys(result).find(key => Array.isArray(result[key]));
          setData(arrayKey ? result[arrayKey] : result);
        } else {
          setData(result);
        }
      } catch (err) {
        console.error(`Error fetching from ${url}:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error, setData };
}
