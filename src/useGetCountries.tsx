import { useState, useEffect } from 'react';

function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        const abortController = new AbortController();
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(url, 
                    { 
                        method: 'GET',
                        headers: {
                            'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
                            'X-RapidAPI-Host': process.env.REACT_APP_RAPIDAPI_HOST
                        },
                        signal: abortController.signal
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    setData(data);
                } else {
                    throw new Error('Error fetching data');
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        return () => {
            abortController.abort();
        }
    }, [url]);
  
    return { data, loading, error };
  }

export default useFetch;