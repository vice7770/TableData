import React, { useState, useRef } from "react";
import { makeData } from "./makeData";
import {countries} from "./const";

function useEndpointData() {
    const numberOfRowsRef = useRef<number>(100)
    const [data] = useState(() => makeData(countries, numberOfRowsRef.current))
    return {data, numberOfRowsRef};
}

export default useEndpointData;
