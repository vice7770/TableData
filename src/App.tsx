import react, { useState, useRef, useEffect } from 'react'
import './App.css'
import ServerDataComponent from './ServerDataComponent'
import DataComponent from './DataComponent'
import Table from './Table'
import { City } from './makeData'
import useEndpointData from './useEndpointData'
import { useThrottle } from '@uidotdev/usehooks'
import useSocketData from './useSocketData'

function App() {
  const { data, totalRowsToGenerate, setTotalRowsToGenerate } = useEndpointData()
  const { connData, rowsToGenerate, setRowsToGenerate, intervalValue, setIntervalValue} = useSocketData(totalRowsToGenerate)
  const [tableData, setTableData] = useState<City[]>([])
  const [mergedData, setMergedData] = useState<City[]>(data)
  const throttledDataRef = useRef<number>(3)
  const throttledData = useThrottle(mergedData, throttledDataRef.current * 1000)

  useEffect(() => {
    if (data) {
      setMergedData(data)
    }
  }, [data])

  return (
    <div className=''>
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
      <Table data={throttledData}/>
    </div>
  )
}

export default App
