import React, { useEffect, useState } from "react";
import { makeRandomData } from "./makeData";
import { City } from "./makeData";
import {countries} from "./const";

function useSocketData() {
    const [connData, setConnData] = useState<City[] | null>(null);
    const [intervalValue, setIntervalValue] = useState<number | null>(1000);
    const [numberOfDataPoints, setNumberOfDataPoints] = useState<number>(80);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const data = makeRandomData(countries, numberOfDataPoints);
            setConnData(data);
        }, intervalValue || 3000);

        return () => {
            clearInterval(intervalId);
        };
    }, [intervalValue, numberOfDataPoints]);

    return { connData, setInterval: setIntervalValue, setNumberOfDataPoints};
}

export default useSocketData;