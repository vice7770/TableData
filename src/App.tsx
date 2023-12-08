import react, { useState, useRef, useEffect } from 'react'
import './App.css'
import ServerDataComponent from './ServerDataComponent'
import DataComponent from './DataComponent'
import Table from './Table'
import { City } from './makeData'
import useEndpointData from './useEndpointData'
function App() {
  const [tableData, setTableData] = useState<City[]>([])
  // const [mergedData, setMergedData] = useState<City[]>([])
  const mergedDataRef = useRef<City[]>(useEndpointData());
  const [intervalValue, setIntervalValue] = useState<number | null>(1000);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
        setTableData(mergedDataRef.current);
    }, intervalValue || 3000);

    return () => {
        clearInterval(intervalId);
    };
  }, [intervalValue, setIntervalValue]);


  return (
    
    <div className=''>
      <ServerDataComponent />
      <br/>
      <DataComponent mergedDataRef={mergedDataRef}/>
      <br/>
      <Table data={tableData}/>
    </div>
  )
}

export default App
