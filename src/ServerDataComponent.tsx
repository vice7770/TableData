import React, { useEffect, useRef, useState } from 'react'
import { City } from './makeData'
import { useDebounce, useLocalStorage, useThrottle } from "@uidotdev/usehooks";
import useGetCountries from './useGetCountries';
import { Country } from './useGetCountries';
import { defaultCoutries } from './const';  
interface Props {
    data: City[],
    connData: City[] | null,
    rowsToGenerate: number,
    setRowsToGenerate: React.Dispatch<React.SetStateAction<number>>,
    intervalValue: number,
    setIntervalValue: React.Dispatch<React.SetStateAction<number>>,
    totalRowsToGenerate: number,
    setTotalRowsToGenerate: React.Dispatch<React.SetStateAction<number>>
}

const BoxComponent = React.memo(({name, interval, data}: {name: string, interval: number, data: any}) => {
    const [backgroundColor, setBackgroundColor] = useState('')
    useEffect(() => {
        setBackgroundColor('red')
        setTimeout(() => {
            setBackgroundColor('')
        }, interval)
    }, [data])
    return (
        <div className='flex items-center justify-center border-2 border-gray-300 m-2 h-full w-full text-3xl' style={{backgroundColor: backgroundColor}}>
            <h3 className='text-3xl'>
                {name}
            </h3>
        </div>
    )
})

type DataListProps = {
    id: string;
    options: string[];
    selectedCapitals: string[];
    setSelectedCapitals: React.Dispatch<React.SetStateAction<string[]>>;
};
  
const DataList = (props: DataListProps) => {
    const { options, selectedCapitals, setSelectedCapitals } = props;
    function handleSelect(option: string) {
        if (selectedCapitals.includes(option)) {
            setSelectedCapitals(selectedCapitals.filter((capital) => capital !== option));
        }
        else{
            setSelectedCapitals([...selectedCapitals, option]);
        }
    }
    
    return (
        <div className="flex flex-col items-center justify-center">
            <label className='text-xl mb-2'>Countries List</label>
            <div className="dropdown border-2 border-gray-300 rounded p-2 max-h-48 overflow-y-auto">
                {options.map((option, index) => (
                    <div
                        key={index}
                        onClick={() => handleSelect(option)}
                        className={`p-2 cursor-pointer ${selectedCapitals.includes(option) ? 'bg-gray-600' : ''}`}
                    >
                        {option}
                    </div>
                ))}
            </div>
        </div>
    );
};

function ServerDataComponent( props : Props ) {
    const {
        data,
        connData,
        rowsToGenerate,
        setRowsToGenerate,
        intervalValue,
        setIntervalValue,
        totalRowsToGenerate,
        setTotalRowsToGenerate,
    } = props;
    const [rowsToGenerateInput, setRowsToGenerateInput] = useState(totalRowsToGenerate);
    const [selectedCapitals, setSelectedCapitals] = useLocalStorage<string[]>("selectedCapitals", []);
    const debouncedValue = useDebounce(rowsToGenerateInput, 300);

    const { countries } = useGetCountries();
    const countriesListRef = useRef(
        countries
            ?.filter((country: Country) => country.region === "Europe" && country.fifa)
            .map((country: Country) => `${country.capital[0]}(${country.fifa})`)
            .sort()
        || defaultCoutries
    );
    useEffect(() => {
        setTotalRowsToGenerate(debouncedValue);
    }, [debouncedValue]);

    return (
        <>
            <div className='flex flex-col items-center justify-center'>
                <div className='flex flex-col items-center mb-7'>
                    <h1 className='text-5xl mt-4'>Server Data</h1>
                </div>
                <div className='flex flex-row gap-8'>
                    <div className='flex flex-col'>
                        <DataList id="countries" options={countriesListRef.current as string[]} selectedCapitals={selectedCapitals} setSelectedCapitals={setSelectedCapitals}/>
                    </div>
                    <div className='flex flex-col'>
                        <label className='text-xl mb-2'>Number of Rows</label>
                        <input type="number" className="ml-4 p-1 border-2 border-gray-300 rounded text-center" defaultValue={rowsToGenerateInput} onChange={(e) => setRowsToGenerateInput(parseInt(e.target.value))}/>
                    </div>
                    <div className='flex flex-col'>
                        <label className='text-xl mb-2'>Number of Rows from Socket</label>
                        <input type="number" className="ml-4 p-1 border-2 border-gray-300 rounded text-center" defaultValue={rowsToGenerate} onChange={(e) => setRowsToGenerate(parseInt(e.target.value))}/>
                    </div>
                    <div className='flex flex-col'>
                        <label className='text-xl mb-2'>Update Interval</label>
                        <input type="number" className="ml-4 p-1 border-2 border-gray-300 rounded text-center" defaultValue={intervalValue} onChange={(e) => setIntervalValue(parseInt(e.target.value))}/>
                    </div>
                </div>
                <div className='flex items-center justify-center border-2 border-gray-300 w-1/3 mt-10 gap-3'>
                    <BoxComponent name='Server' interval={3000} data={data}/>
                    <BoxComponent name='Socket' interval={1000} data={useThrottle(connData, 100)}/>
                </div>
            </div>
        </>
    )
}

const MemoizedServerDataComponent = React.memo(ServerDataComponent);

export default MemoizedServerDataComponent;