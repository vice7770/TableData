import React, { useState, useEffect } from 'react';
import { useThrottle } from '@uidotdev/usehooks'

function useMouse() {
    const [isMouseDown, setIsMouseDown] = useState(false);
    const throttledIsMouseDown = useThrottle(isMouseDown, 200)
    useEffect(() => {
        const handleMouseDown = () => {
            setIsMouseDown(true);
        };

        const handleMouseUp = () => {
            setIsMouseDown(false);
        };

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        // Clean up the event listeners on unmount
        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []); // Empty dependency array means this effect runs once on mount and clean up on unmount

   return throttledIsMouseDown;
    // return isMouseDown;
}

export default useMouse;