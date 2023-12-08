import react, { useEffect, useState } from 'react'
import useEndpointData from './useEndpointData'
import useSocketData from './useSocketData'

export default function ServerDataComponent() {
    const data = useEndpointData()
    const { connData } = useSocketData()
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
        </div>
    )
}