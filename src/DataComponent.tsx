import react, { useEffect, useState } from 'react'
import useEndpointData from './useEndpointData'
import useSocketData from './useSocketData'
import { City } from './makeData'

interface Props {
    // mergedDataRef: react.MutableRefObject<City[]>,
    mergedData: City[],
    setMergedData: react.Dispatch<react.SetStateAction<City[]>>
}

export default function DataComponent(props : Props) {
    const data = useEndpointData() // this is just for trigger the useEffect
    const { mergedData, setMergedData } = props;
    const { connData } = useSocketData()
    const [backgroundColor, setBackgroundColor] = useState('')
    const [mergeDataTime, setMergeDataTime] = useState(0)

    useEffect(() => {
        if (data || connData) { 
            setBackgroundColor('red')
            setTimeout(() => {
                setBackgroundColor('')
            }, 1000)
        }
    }, [data,connData])
    // const mergedData = mergeData(mergedDataRef.current, connData)
    // console.log('mergedData', mergedData)
    // mergedDataRef.current = mergedData

    //Merge server data with socket data
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
        <div className='flex flex-row items-center justify-center mb-10'>
            <div className='flex items-center justify-center border-2 border-red-100 w-1/3 gap-3' style={{backgroundColor: backgroundColor}}>
                <h3 className='text-2xl'>
                    Data
                </h3>
                <span className='text-xl ml-4'>
                    {mergeDataTime.toFixed(4)} ms
                </span>
            </div>
            <input type="number" name='T' className="ml-4 p-1 border-2 border-gray-300 rounded" />
        </div>
    )
}