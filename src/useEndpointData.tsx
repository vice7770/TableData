import React, { useState, useRef } from "react";
import { makeData } from "./makeData";
import {countries} from "./const";

// interface Props {
//     rowsToGenerateRef?: number
// }

function useEndpointData() {
    // const { rowsToGenerateRef = 100 } = props;
    // const numberOfRowsRef = useRef<number>(100)
    const [data] = useState(() => makeData(countries, 100))
    return {data};
}

export default useEndpointData;
