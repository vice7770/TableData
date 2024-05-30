import React, { useState, useEffect } from 'react';
import { useThrottle } from '@uidotdev/usehooks'

function useMouse(props : { isHovering: boolean}) {
    const { isHovering } = props;
    const [isMouseDown, setIsMouseDown] = useState(false);
    const throttledIsMouseDown = useThrottle(isMouseDown, 100)
    useEffect(() => {
        const handleMouseDown = () => {
            if (isHovering) {
                setIsMouseDown(true);
            }
        };

        const handleMouseUp = () => {
            if (isHovering) {
                setIsMouseDown(false);
            }
        };

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        // Clean up the event listeners on unmount
        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isHovering]); // Add isHovering to the dependency array

   return throttledIsMouseDown;
}

export default useMouse;