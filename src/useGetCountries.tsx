import { useState, useEffect } from 'react';

function useFetch() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/countries';
  
    useEffect(() => {
        const abortController = new AbortController();
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(url, 
                    { 
                        method: 'GET',
                        headers: {
                            'X-RapidAPI-Key': 'cd969b94f8msh4723041a9be570cp1f612bjsn282973c1014c',
                            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
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