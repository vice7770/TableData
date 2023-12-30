import react, { useState, useRef, useEffect } from 'react'
import './App.css'
import ServerDataComponent from './ServerDataComponent'
import DataComponent from './DataComponent'
import Table from './Table'
import { City } from './makeData'
import useEndpointData from './useEndpointData'
import { useLocalStorage, useThrottle, useWindowScroll, useWindowSize } from '@uidotdev/usehooks'
import useSocketData from './useSocketData'

function App() {
  const { data, totalRowsToGenerate, setTotalRowsToGenerate } = useEndpointData()
  const { connData, rowsToGenerate, setRowsToGenerate, intervalValue, setIntervalValue} = useSocketData(totalRowsToGenerate)
  const [mergedData, setMergedData] = useState<City[]>(data)
  const [selectedCapitals] = useLocalStorage<string[]>("selectedCapitals", []);

  const throttledDataRef = useRef<number>(3)
  const throttledData = useThrottle(mergedData, throttledDataRef.current * 1000)
  const [{ x, y }, scrollTo] = useWindowScroll();
  const size = useWindowSize();

  const shouldShowButton = (y && y > (size.height || 0)/2) || (x && ((x < (size.width || 0)/2 - 100) || x > (size.width || 0)/2 + 100));
  
  useEffect(() => {
    if (data) {
      setMergedData(data)
    }
  }, [data])

  const handleScroll = () => {
    const width = size.width || 0;
    scrollTo({ left: width / 2, top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if(size.height && size.width) {
      handleScroll()
    }
  }, [size])

  return (
    <div className='flex flex-col items-center justify-center w-fit'>
      {!!shouldShowButton && (
        <button 
          className="fixed right-20 top-20 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded z-10" 
          onClick={handleScroll}
        >
          Bring me back!
        </button>
      )}
      <ServerDataComponent 
        data={data} 
        connData={connData} 
        rowsToGenerate={rowsToGenerate} 
        setRowsToGenerate={setRowsToGenerate} 
        intervalValue={intervalValue} 
        setIntervalValue={setIntervalValue}
        totalRowsToGenerate={totalRowsToGenerate}
        setTotalRowsToGenerate={setTotalRowsToGenerate}
      />
      <br/>
      <DataComponent 
        data={data}
        connData={connData} 
        mergedData={mergedData} 
        setMergedData={setMergedData} 
        throttledDataRef={throttledDataRef}
      />
      <br/>

      {mergedData?.length > 0  ? <Table data={throttledData} selectedCapitals={selectedCapitals} /> : <p className='text-5xl'> Please Select a country </p>}
      <aside style={{ position: "fixed", bottom: 0, right: 0 }}>
        Coordinates <span className="x">x: {x}</span>{" "}
        <span className="y">y: {y}</span>{" "}
      </aside>
    </div>

  )
}

export default App
