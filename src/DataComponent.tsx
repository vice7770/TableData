import React, { useEffect, useState } from 'react'
import { City } from './makeData'
import { useThrottle } from '@uidotdev/usehooks';
import useGetCountries from './useGetCountries';

interface Props {
    data: City[],
    connData: City[] | null,
    mergedData: City[],
    setMergedData: React.Dispatch<React.SetStateAction<City[]>>,
    throttledDataRef: React.MutableRefObject<number>
}

const BoxComponent = React.memo(({name, interval, mergeDataTime, data, throttledConnData}: {name: string, interval: number, mergeDataTime: number, data: any, throttledConnData: any}) => {
    const [backgroundColor, setBackgroundColor] = useState('')
    useEffect(() => {
        setBackgroundColor('red')
        setTimeout(() => {
            setBackgroundColor('')
        }, interval)
    }, [data,throttledConnData])
    return (
        <div className='flex items-center justify-center border-2 border-red-100 m-2 h-full w-full text-3xl' style={{backgroundColor: backgroundColor}}>
            <h3 className='text-3xl'>
                {name}
            </h3>
            <span className='text-xl ml-4'>
                {mergeDataTime.toFixed(5)} ms
            </span>
        </div>
    )
})

export default function DataComponent(props : Props) {
    const { data, connData, mergedData, setMergedData, throttledDataRef } = props;
    const [mergeDataTime, setMergeDataTime] = useState(0)
    // const { data : countriesData } = useGetCountries();

    const throttledConnData = useThrottle(connData, 100);

    useEffect(() => {
        if(!connData) return;
        const startTime = performance.now();
        const dataMap = new Map(mergedData.map(city => [city.name, city]));
        const newData = connData.map((country) => {
            const countryInData = dataMap.get(country.name);
            if (countryInData) {
                const weatherMap = new Map(countryInData.weather.map(dayWeather => [dayWeather.day, dayWeather]));
                country.weather.forEach(dayWeather => {
                    if (weatherMap.has(dayWeather.day)) {
                        weatherMap.set(dayWeather.day, dayWeather);
                    }  
                });
                return {...countryInData, weather: Array.from(weatherMap.values())};
            }
            return country;
        });
        setMergedData(newData)
        const endTime = performance.now();
        const time = endTime - startTime;
        setMergeDataTime(time);
    }, [connData])

    return (
        <div className='flex flex-row items-center justify-center mb-2'>
            <BoxComponent name='Data' interval={1000} mergeDataTime={mergeDataTime} data={data} throttledConnData={throttledConnData}/>
            <label className='text-xl ml-4'>Throttle</label>
            <input type="number" name='throttle' className="ml-4 p-1 border-2 border-gray-300 rounded text-center" min="0" defaultValue={throttledDataRef.current} onChange={(e) => throttledDataRef.current = parseInt(e.target.value, 10)}/>
        </div>
    )
}