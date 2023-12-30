import { useState, useEffect } from 'react';
import { useLocalStorage } from "@uidotdev/usehooks";


export type Country = {
    name: {
      common: string;
      official: string;
      nativeName: {
        eng: {
          official: string;
          common: string;
        };
      };
    };
    capital: string[];
    region: string;
    flags: {
        svg: string;
        png: string;
    };
    fifa: string;
  };

function useGetCountries() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [countries, setCountries] = useLocalStorage<Country[] | null>("countries", []);
    const url = 'https://restcountries.com/v3.1/all';
    // const params = {
    //     // fields: 'currency,currency_num_code,currency_code,continent_code,currency,iso_a3,dial_code',
    //     // continent_code: 'EU',
    //     // limit: '250'
    // }

    // const queryString = new URLSearchParams(params).toString();
    // const urlWithParams = `${url}?${queryString}`;
    useEffect(() => {
        const abortController = new AbortController();
        if(countries?.length) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(url, 
                    { 
                        method: 'GET',
                        // headers: {
                        //     'X-RapidAPI-Key': 'process.env.REACT_APP_RAPID_API_KEY',
                        //     'X-RapidAPI-Host': 'process.env.REACT_APP_RAPID_API_HOST'
                        // },
                        signal: abortController.signal,
                        
                    }
                );
                if (response.ok) {
                    const data = await response.json() as Country[];
                    setCountries(data);
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
  
    return { countries, loading, error };
  }

export default useGetCountries;