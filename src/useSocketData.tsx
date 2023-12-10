import React, { useEffect, useState } from "react";
import { makeRandomData } from "./makeData";
import { City } from "./makeData";
import {countries} from "./const";

function useSocketData() {
    const [connData, setConnData] = useState<City[] | null>(null);
    const [intervalValue, setIntervalValue] = useState<number | null>(1000);
    // const [numberOfDataPoints, setNumberOfDataPoints] = useState<number>(10);
    const [rowsToGenerate, setRowsToGenerate] = useState<number>(10);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const data = makeRandomData(countries, rowsToGenerate);
            setConnData(data);
        }, intervalValue || 3000);

        return () => {
            clearInterval(intervalId);
        };
    }, [intervalValue, rowsToGenerate]);

    return { connData, intervalValue, setInterval: setIntervalValue, rowsToGenerate, setRowsToGenerate};
}

export default useSocketData;