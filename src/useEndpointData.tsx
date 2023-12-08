import React, { useState } from "react";
import { makeData } from "./makeData";
import {countries} from "./const";

function useEndpointData() {
    const [data] = useState(() => makeData(countries, 100))
    return data;
}

export default useEndpointData;
