import react, { useState, useRef, useEffect } from 'react'
import './App.css'
import ServerDataComponent from './ServerDataComponent'
import DataComponent from './DataComponent'
import Table from './Table'
import { City } from './makeData'
import useEndpointData from './useEndpointData'

function App() {
  const [mergedData, setMergedData] = useState<City[]>(useEndpointData())

  return (
    <div className=''>
      <ServerDataComponent />
      <br/>
      <DataComponent mergedData={mergedData} setMergedData={setMergedData}/>
      <br/>
      <Table data={mergedData}/>
    </div>
  )
}

export default App
