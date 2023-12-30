import React, { useEffect, useRef, useState } from "react";
import { makeRandomData } from "./makeData";
import { City } from "./makeData";
import { useLocalStorage } from "@uidotdev/usehooks";
// import {countries} from "./const";

function useSocketData( totalRowsToGenerate : number) {
    const [connData, setConnData] = useState<City[] | null>(null);
    const [intervalValue, setIntervalValue] = useState<number>(1000);
    const [rowsToGenerate, setRowsToGenerate] = useState<number>(10);
    const [selectedCapitals] = useLocalStorage<string[]>("selectedCapitals", []);
    useEffect(() => {
        if(selectedCapitals.length === 0) return;
        const intervalId = setInterval(() => {
            const data = makeRandomData(selectedCapitals, rowsToGenerate, totalRowsToGenerate);
            setConnData(data);
        }, intervalValue);

        return () => {
            clearInterval(intervalId);
        };
    }, [intervalValue, rowsToGenerate, totalRowsToGenerate, selectedCapitals]);

    return { connData, intervalValue, setIntervalValue, rowsToGenerate, setRowsToGenerate};
}

export default useSocketData;