import React, { useEffect, useState } from "react";
import { makeRandomData } from "./makeData";
import { City } from "./makeData";
import {countries} from "./const";

function useSocketData( totalRowsToGenerate : number) {
    const [connData, setConnData] = useState<City[] | null>(null);
    const [intervalValue, setIntervalValue] = useState<number>(1000);
    // const [numberOfDataPoints, setNumberOfDataPoints] = useState<number>(10);
    const [rowsToGenerate, setRowsToGenerate] = useState<number>(10);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const data = makeRandomData(countries, rowsToGenerate, totalRowsToGenerate);
            setConnData(data);
        }, intervalValue);

        return () => {
            clearInterval(intervalId);
        };
    }, [intervalValue, rowsToGenerate, totalRowsToGenerate]);

    return { connData, intervalValue, setIntervalValue, rowsToGenerate, setRowsToGenerate};
}

export default useSocketData;