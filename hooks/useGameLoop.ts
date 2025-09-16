import { useEffect, useRef } from 'react';

// FIX: Refactored the hook to initialize useRef with the callback, simplifying the logic and resolving the "Expected 1 arguments, but got 0" error.
export const useGameLoop = (callback: () => void, delay: number) => {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};
