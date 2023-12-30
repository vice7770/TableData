import React, { useState, useEffect } from "react";
import { makeData } from "./makeData";
import { useLocalStorage } from "@uidotdev/usehooks";

function useEndpointData() {
    const [totalRowsToGenerate, setTotalRowsToGenerate] = useState<number>(100);
    const [selectedCapitals] = useLocalStorage<string[]>("selectedCapitals", []);
    const [data, setData] = useState(() => makeData(selectedCapitals, totalRowsToGenerate));
    useEffect(() => {
        const newData = makeData(selectedCapitals, totalRowsToGenerate)
        setData(newData)
    },[totalRowsToGenerate, selectedCapitals.length])
    return {data, totalRowsToGenerate, setTotalRowsToGenerate};
}

export default useEndpointData;
