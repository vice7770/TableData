import React, { useEffect, useMemo, useRef, useState } from "react";
import { City } from "./makeData";
import { flexRender, getCoreRowModel, useReactTable, createColumnHelper, ColumnDef, CellContext, Cell, Row, HeaderGroup } from "@tanstack/react-table";
import './index.css'
import { conditions } from "./const";
import { useMeasure } from "@uidotdev/usehooks";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
// import { MyHookContext } from "./App";
import LagRadar from 'react-lag-radar';
import { FpsView } from "react-fps";

interface Props {
    data: City[];
    setTableSize: React.Dispatch<React.SetStateAction<{ width: number; height: number; }>>;
    isMouseDown: boolean;
}

type WeatherData = {
    [key: string]: string | number;
};

interface SelectedRange {
    startRow: number | null;
    endRow: number | null;
    startCol: string | null;
    endCol: string | null;
}

const columnHelper = createColumnHelper<any>()

// function Td({ cell }: { cell: Cell<WeatherData, unknown> , key : string}) {
//     const [ref, entry] = useIntersectionObserver({
//         threshold: 0,
//         root: null,
//         rootMargin: "300px",
//     });
//     // console.log('entry', entry?.isIntersecting, cell.column.id)
//     return (
//         <td key={cell.id} ref={ref} className="min-w-[70px]">
//             {entry?.isIntersecting ? flexRender(cell.column.columnDef.cell, cell.getContext()) : null}
//         </td>
//     )
// }

function TRBody({ row }: { row: Row<WeatherData>}) {
    // console.log('row', row)
    return (
        <tr key={row?.id}>
            {row?.getVisibleCells().map(cell => {
                return (
                    <td key={cell.id} style={{minWidth: 90, maxHeight: 18}}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                )
            })}
        </tr>
    )
}

function DivHeader({ headerGroup, index }: { headerGroup: HeaderGroup<WeatherData>, index: number }) {
    const width = index === 1 ? 90 : 90 * 3
    return (
        <div key={headerGroup?.id} className="flex border-b-2 border-gray-200 text-center">
            {headerGroup?.headers.map((header) => (
                <div key={header.id} className="py-1 text-sm font-semibold" style={{width: (header.index === 0 && index === 0) ? width + 90 : width, height: 25}}>
                    {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                        )}
                </div>
            ))}
        </div>
    )
}

function DivRow({ row }: { row: Row<WeatherData>}) {
    return (
        <div key={row?.id} className="flex">
            {row?.getVisibleCells().map(cell => {
                return (
                    <div key={cell.id} style={{minWidth: 90, minHeight: 25}} className="flex-none">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                )
            })}
        </div>
    )
}

function Table(props : Props) {
    const { data, setTableSize, isMouseDown } = props;
    const [tableRef, { width }] = useMeasure();
    const [cellSelected, setCellSelected] = useState<Cell<any,any> | null>(null);
    const [currentHoveredCell, setCurrentHoveredCell] = useState<Cell<any,any> | null>(null);
    const [selectedRange, setSelectedRange] = useState<SelectedRange>({
        startRow: null,
        endRow: null,
        startCol: null,
        endCol: null,
    });
    // const {isMouseDown} = useContext(MyHookContext);
    const [columnsId, setColumnsId] = useState<string[]>([]);

    const [isScrolling, setIsScrolling] = useState(false);

    const prevFormattedData = useRef<WeatherData[] | null>(null);


    useEffect(() => {
        if (isMouseDown) {
            if(!currentHoveredCell || !currentHoveredCell.row || !currentHoveredCell.column) {
                return;
            }
            if(selectedRange.startRow && selectedRange.startCol && cellSelected?.row && selectedRange.startCol && cellSelected?.column){
                const startRow = currentHoveredCell.row.index < cellSelected.row.index ? currentHoveredCell.row.index : cellSelected.row.index;
                const endRow = currentHoveredCell.row.index > cellSelected.row.index ? currentHoveredCell.row.index : cellSelected.row.index;
                const startColumnIndex = columnsId.indexOf(cellSelected?.column.id);
                const endColumnIndex = columnsId.indexOf(currentHoveredCell.column.id);
                const startColIndex = startColumnIndex < endColumnIndex ? cellSelected.column.id : currentHoveredCell.column.id;
                const endColIndex = startColumnIndex < endColumnIndex ? currentHoveredCell.column.id : cellSelected.column.id;
                setSelectedRange({
                    startRow,
                    endRow,
                    startCol: startColIndex,
                    endCol: endColIndex,
                })
            } 
        }
    }, [isMouseDown, currentHoveredCell])

    const formattedData = useMemo(() => {
        const result: WeatherData[] = [];
        if (!data) {
            return result;
        }
        if (isScrolling) {
            return prevFormattedData.current;
        }
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
        prevFormattedData.current = result;
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

        const handleMouseDown = () => {
            setCurrentHoveredCell(info.cell);
            setCellSelected(info.cell);
            setSelectedRange(
                {
                    startRow: info.row.index,
                    endRow: info.row.index,
                    startCol: info.column.id,
                    endCol: info.column.id,
                }
            )
        };

        const handleMouseEnter = () => {
            if(isMouseDown) {
                setCurrentHoveredCell(info.cell);
            }
        }

        // const handleClick = () => { 
        //     setCellSelected(info.cell.id);
        //     setSelectedRange(
        //         {
        //             startRow: info.row.index,
        //             endRow: info.row.index,
        //             startCol: info.column.id,
        //             endCol: info.column.id,
        //         }
        //     )
        // }
        const className = getBackgroundColor(info.column.id, info.getValue())
        const border = cellSelected?.id === info.cell.id ? 'border-2 border-yellow-500' : '';
        // const borderSelectedTop = (selectedRange && selectedRange.startRow && selectedRange.startRow > info.row.index )? ' border-t-1 border-yellow-500' : '';
        // const borderSelectedLeft =
        //   cellSelected?.id !== info.cell.id &&
        //   selectedRange &&
        //   selectedRange.startCol &&
        //   selectedRange?.startRow &&
        //   selectedRange?.endRow &&
        //   selectedRange.startCol === info.column.id &&
        //   selectedRange?.startRow <= info.row.index &&
        //   selectedRange?.endRow >= info.row.index
        //     ? " border-l-2 border-red-500"
        //     : "";
        
        const bgIsSelected =
          (selectedRange.startRow &&
          selectedRange.endRow &&
          selectedRange.startRow <= info.row.index &&
          selectedRange.endRow >= info.row.index) &&
          (selectedRange.startCol &&
          selectedRange.endCol &&
          columnsId.indexOf(selectedRange.startCol) <=
          columnsId.indexOf(info.column.id) &&
          columnsId.indexOf(selectedRange.endCol) >=
          columnsId.indexOf(info.column.id)) 

        return (
            <div className={className + " text-white text-center select-none relative " + border} onMouseEnter={handleMouseEnter} onMouseDown={handleMouseDown} >
                {bgIsSelected && <div className="absolute inset-0 bg-slate-400 opacity-50"></div>}
                <span style={{ pointerEvents: 'none' }}>{info.getValue()}</span>
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
    // }, [data.length, cellSelected, selectedRange, isMouseDown]);
    }, [data.length, cellSelected, selectedRange, isMouseDown]);

    useEffect(() => {
        const ids = columns.reduce((acc, column) => {
            const ids = column.columns.map((col : any) => col.id);
            return [...acc, ...ids];
        }, []);
    
        // Set the state
        setColumnsId(ids);
    }, [columns.length]);

    // const columnsId = useMemo(() => {
    //     //go through the columns and get the id
    //     return columns.reduce((acc, column) => {
    //         const ids = column.columns.map((col : any) => col.id);
    //         return [...acc, ...ids];
    //     }, []);
    // }, [columns.length])

    const table = useReactTable({
        data: formattedData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    useEffect(() => {
        setTableSize({ width: width || 0  , height: 0 });
    }, [width]);

    const { rows } = table.getRowModel()
    const headers = table.getHeaderGroups()

    const parentRef = React.useRef<HTMLDivElement | null>(null)

    const virtualizer = useWindowVirtualizer({
        count: rows.length,
        estimateSize: () => 25,
        overscan: 30,
        scrollMargin: parentRef.current?.offsetTop ?? 0,
    })

    const headerCount = headers?.map(header => header.headers.map(header => header.column))[1]?.length

    useEffect(() => {
        console.log('virtualizer', virtualizer.isScrolling)
        setIsScrolling(virtualizer.isScrolling)
    }, [virtualizer.isScrolling])

    return (
        <>
            <div ref={parentRef} style={{ maxWidth: `${(headerCount * 90)}px`, border: '1px solid #c8c8c8', padding: '1px' }}>
                <div
                    ref={tableRef}
                    style={{
                        height: `${virtualizer.getTotalSize()}px`,
                        width: `${(headerCount * 90)}px`,
                        position: 'relative',
                    }}
                >
                    {virtualizer.getVirtualItems().map((item) => (
                        <div
                            key={item.key}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: `${item.size}px`,
                                transform: `translateY(${
                                item.start - virtualizer.options.scrollMargin
                                }px)`,
                            }}
                        >
                            {
                                item.index < 2 ? 
                                <DivHeader headerGroup={headers[item.index]} index={item.index}/>
                                :
                                <DivRow row={rows[item.index]}/>
                            }

                        </div>
                    ))}

                </div>
            </div>
            {/* <aside style={{ position: "fixed", top: 0, left: 0 }}>
                <LagRadar
                    frames={20}
                    speed={0.0017}
                    size={200}
                    inset={3}
                />
                <FpsView/>
            </aside> */}
        </>
    )
}

export default React.memo(Table)