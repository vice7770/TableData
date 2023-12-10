import react, { useEffect, useState } from 'react'
import { City } from './makeData'

interface Props {
    data: City[],
    connData: City[] | null,
    rowsToGenerate: number,
    setRowsToGenerate: react.Dispatch<react.SetStateAction<number>>,
}

export default function ServerDataComponent( props : Props) {
    const { data, connData, rowsToGenerate, setRowsToGenerate } = props;
    const [backgroundColor, setBackgroundColor] = useState('')
    const [backgroundColorConn, setBackgroundColorConn] = useState('')
    useEffect(() => {
        if (data) {
            setBackgroundColor('red')
            setTimeout(() => {
                setBackgroundColor('')
            }, 3000)
        }
    }, [data])

    useEffect(() => {
        if (connData) {
            setBackgroundColorConn('red')
            setTimeout(() => {
                setBackgroundColorConn('')
            }, 1000)
        }
    }, [connData])

    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='flex flex-col items-center'>
                <h1 className='text-5xl'>Server Data</h1>
            </div>
            <div className='flex flex-col items-center'>
                <label className='text-xl ml-4'>Number of Rows</label>
                <input type="number" className="ml-4 p-1 border-2 border-gray-300 rounded text-center" defaultValue={rowsToGenerate} onChange={(e) => setRowsToGenerate(parseInt(e.target.value))}/>
            </div>
            <div className='flex items-center justify-center border-2 border-red-100 w-1/3 m-10 gap-3'>
                <div className='flex items-center justify-center border-2 border-red-100 m-2 h-full w-full text-3xl' style={{backgroundColor: backgroundColor}}>
                    <h3 className='text-3xl'>
                        Endpoint
                    </h3>
                </div>
                <div className='flex items-center justify-center border-2 border-red-100 m-2 h-full w-full text-3xl' style={{backgroundColor: backgroundColorConn}}>
                    <h3 className='text-3xl'>Socket Conn</h3>
                </div>
            </div>
            <label className='text-xl ml-4'>Throttle</label>
            {/* <input type="number" name='throttle' className="ml-4 p-1 border-2 border-gray-300 rounded text-center" defaultValue={throttledDataRef.current} onChange={(e) => throttledDataRef.current = parseInt(e.target.value, 10)}/> */}
        </div>
    )
}