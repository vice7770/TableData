import React, { useEffect, useMemo } from "react";
import { City, dayWeather } from "./makeData";
import { flexRender, getCoreRowModel, useReactTable, createColumnHelper, ColumnDef, CellContext, Cell, Row } from "@tanstack/react-table";
import './index.css'
import { conditions } from "./const";
import { useIntersectionObserver } from "@uidotdev/usehooks";

interface Props {
    data: City[];
}

type WeatherData = {
    [key: string]: string | number;
  };

const columnHelper = createColumnHelper<any>()

// function Td({ cell }: { cell: Cell<WeatherData, unknown> }) {
//     const [ref, entry] = useIntersectionObserver({
//         threshold: 0,
//         root: null,
//         rootMargin: "0px",
//     });
//     // console.log('entry', entry?.isIntersecting, cell.column.id)
//     return (
//         <td key={cell.id} ref={ref}>
//             {entry?.isIntersecting ? flexRender(cell.column.columnDef.cell, cell.getContext()) : null}
//         </td>
//     )
// }

function TR({ row }: { row: Row<WeatherData>, key: string }) {
    const [ref, entry] = useIntersectionObserver({
        threshold: 0,
        root: null,
        rootMargin: "500px",
    });
    return (
        <tr key={row.id} ref={ref}>
            {row.getVisibleCells().map(cell => {
                return entry?.isIntersecting ? (
                    <td key={cell.id} className="min-w-[70px]">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                ) : <td key={cell.id}/>;
            })}
        </tr>
    )
}

function Table(props : Props) {
    const { data } = props;
    const formattedData = useMemo(() => {
        const result: WeatherData[] = [];
        data.forEach((city, index) => {
            city.weather.forEach((dayWeather, dayIndex) => {
                const dayWeather_: WeatherData = {
                    [`day_${city.name}`]: dayWeather.day,
                    [`humidity_${city.name}`]: dayWeather.humidity,
                    [`temp_${city.name}`]: dayWeather.temp,
                    [`windSpeed_${city.name}`]: dayWeather.windSpeed,
                };
                if (result[dayIndex]) {
                    result[dayIndex] = { ...result[dayIndex], ...dayWeather_ };
                } else {
                    result[dayIndex] = dayWeather_;
                }
            });
        });
        return result;
    }, [data]);
    
    const cellFormatter = (info : CellContext<any, any>) => {
        const getBackgroundColor = (columnId: string, value: number) => {
            if (columnId.includes('humidity')) {
                if (value >= conditions.humidity.humid) {
                    return 'bg-blue-700 bg-opacity-80';
                } else if (value <= conditions.humidity.dry) {
                    return 'bg-blue-700 bg-opacity-20';
                }
            } else if (columnId.includes('temp')) {
                if (value >= conditions.temp.hot) {
                    return 'bg-red-700 bg-opacity-80';
                } else if (value <= conditions.temp.cold) {
                    return '';
                }
            } else if (columnId.includes('wind')) {
                if (value >= conditions.windSpeed.windy) {
                    return 'bg-blue-400 bg-opacity-80';
                } else if (value <= conditions.windSpeed.calm) {
                    return 'bg-blue-200 bg-opacity-80';
                }
            }
        }
        const className = getBackgroundColor(info.column.id, info.getValue())
        return (
            <div className={className + " text-white text-center"}>
                <span>{info.getValue()}</span>
            </div>
        )
    }

    const columns : any = useMemo(() => {
        return data.map((city, index) => {
            if(index === 0) {
                return (
                    columnHelper.group({
                        id: city.name,
                        header: () => <span>{city.name}</span>,
                        columns: [
                            columnHelper.accessor("day_" + city.name, {
                                id: 'day_' + city.name,
                                header: () => <span>Day</span>,
                                cell: (info) => cellFormatter(info),
                            }),
                            columnHelper.accessor("humidity_" + city.name, {
                                id: 'humidity_' + city.name,
                                header: () => <span>Humidity</span>,
                                cell: (info) => cellFormatter(info),
                            }),
                            columnHelper.accessor("temp_" + city.name, {
                                id: 'temp_' + city.name,
                                header: () => <span>Temperature</span>,
                                cell: (info) => cellFormatter(info),
                            }),
                            columnHelper.accessor("windSpeed_" + city.name, {
                                id: 'windSpeed_' + city.name,
                                header: () => <span>WindSpeed</span>,
                                cell: (info) => cellFormatter(info),
                            }),
                        ],
                    })
                )
            }
            else {
                return (
                    columnHelper.group({
                        id: city.name,
                        header: () => <span>{city.name}</span>,
                        columns: [
                            columnHelper.accessor("humidity_" + city.name, {
                                id: 'humidity_' + city.name,
                                header: () => <span>Humidity</span>,
                                cell: (info) => cellFormatter(info),
                            }),
                            columnHelper.accessor("temp_" + city.name, {
                                id: 'temp_' + city.name,
                                header: () => <span>Temperature</span>,
                                cell: (info) => cellFormatter(info),
                            }),
                            columnHelper.accessor("windSpeed_" + city.name, {
                                id: 'windSpeed_' + city.name,
                                header: () => <span>WindSpeed</span>,
                                cell: (info) => cellFormatter(info),
                                
                            }),
                        ],
                    })
                )
            }
        })
    }, []);

    // console.log('formattedData', formattedData)
    const table = useReactTable({
        data: formattedData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
    return (
        <div className="flex p-2">
            <div className="h-2" />
            <table className="table-auto w-full text-left whitespace-no-wrap divide-y-2 divide-gray-200 border-2 border-gray-200 rounded-md">
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id} className="border-b-2 border-gray-200 text-center">
                    {headerGroup.headers.map(header => (
                        <th key={header.id} colSpan={header.colSpan} className="px-4 py-2 text-sm font-semibold">
                        {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                            )}
                        </th>
                    ))}
                    </tr>
                ))}
                </thead>
                <tbody className="text-sm font-normal">
                {table.getRowModel().rows.map(row => (
                    <TR row={row} key={row.id}/>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default Table