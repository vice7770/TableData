import React, { useState, useRef, useEffect } from "react";
import { makeData } from "./makeData";
import {countries} from "./const";

// interface Props {
//     rowsToGenerateRef?: number
// }

function useEndpointData() {
    const [totalRowsToGenerate, setTotalRowsToGenerate] = useState<number>(100);
    const [data, setData] = useState(() => makeData(countries, totalRowsToGenerate))
    useEffect(() => {
        const newData = makeData(countries, totalRowsToGenerate)
        setData(newData)
    },[totalRowsToGenerate])
    return {data, totalRowsToGenerate, setTotalRowsToGenerate};
}

export default useEndpointData;
