import react, { useState, useRef, useEffect, createContext } from 'react'
import './App.css'
import ServerDataComponent from './ServerDataComponent'
import DataComponent from './DataComponent'
import Table from './Table'
import { City } from './makeData'
import useEndpointData from './useEndpointData'
import { useHover, useThrottle, useWindowScroll, useWindowSize } from '@uidotdev/usehooks'
import useSocketData from './useSocketData'
import useMouse from './useMouse'
import DonutGraph from './DonutGraph'
import { conditions } from './const'

export interface DonutData {
  label: string
  value: number
  color: string
}

function App() {
  const { data, totalRowsToGenerate, setTotalRowsToGenerate } = useEndpointData()
  const { connData, rowsToGenerate, setRowsToGenerate, intervalValue, setIntervalValue} = useSocketData(totalRowsToGenerate)
  const [mergedData, setMergedData] = useState<City[]>(data)
  const [donutData, setDonutData] = useState<DonutData[]>([])

  const throttledDataRef = useRef<number>(3)
  const throttledData = useThrottle(mergedData, throttledDataRef.current * 1000)
  const [{ x, y }, scrollTo] = useWindowScroll();
  const size = useWindowSize();
  const [tableSize, setTableSize] = useState({ width: 0, height: 0 });

  const shouldShowButton = (y && y > (size.height || 0)/2) || (x && ((x < (size.width || 0)/2 - 100) || x > (size.width || 0)/2 + 100));
  const className = 'flex flex-col items-center justify-center ' + (tableSize.width >= (size.width || 0) ? 'w-fit' : '');
  const { scrollWidth, clientWidth } = document.documentElement;
  const halfMaxX = (scrollWidth - clientWidth) / 2;

  const [refHover, isHovering] = useHover();
  const isMouseDown = useMouse({isHovering});

  // const donutData = [
  //   { label: 'A', value: 30 },
  //   { label: 'B', value: 70 },
  //   { label: 'C', value: 50 },
  // ];

  useEffect(() => {
    if (data) {
      setMergedData(data)
    }
  }, [data])

  useEffect(() => {
    function processDonuData(data: City[]) {
      const donutData : DonutData[] = [
        {
          label: "hot",
          value: 0,
          color: '#ff0000'
        },
        {
          label: "humid",
          value: 0,
          color: '#0000ff'
        },
        {
          label: "windy",
          value: 0,
          color: '#add8e6'
        }            
      ]
      data.forEach((country) => {
        country.weather.forEach((day) => {
          if(day.temp >= conditions.temp.hot){
            donutData[0].value += 1
          }
          if(day.humidity >= conditions.humidity.humid){
            donutData[1].value += 1
          }
          if(day.windSpeed >= conditions.windSpeed.windy){
            donutData[2].value += 1
          }
        })
      })
      return donutData;
    }
    setDonutData(processDonuData(throttledData))
  },[throttledData])
  

  const handleScrollSmooth = () => {
    scrollTo({
      left: halfMaxX,
      top: 0,
      behavior:"smooth"
    });
  };

  // const handleScroll = () => {
  //   scrollTo({
  //     left: halfMaxX,
  //     top: 0,
  //   });
  // };

  // useEffect(() => {
  //   handleScroll()
  // }, [tableSize])

  return (
    <div className={className}>
      {!!shouldShowButton && (
        <button
          className="fixed right-20 top-20 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded z-10"
          onClick={handleScrollSmooth}
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
      <br />
      <DataComponent
        data={data}
        connData={connData}
        mergedData={mergedData}
        setMergedData={setMergedData}
        throttledDataRef={throttledDataRef}
      />
      <br />
      <DonutGraph data={donutData} />
      {throttledData?.length > 0 ? (
        <div ref={refHover}>
          <Table data={throttledData} setTableSize={setTableSize} isMouseDown={isMouseDown}/>
        </div>
      ) : (
        <p className="text-5xl"> Please Select a country </p>
      )}
      <aside style={{ position: "fixed", bottom: 0, right: 0 }}>
        Coordinates <span className="x">x: {x}</span>{" "}
        <span className="y">y: {y}</span>{" "}
      </aside>
    </div>
  );
}

export default App
