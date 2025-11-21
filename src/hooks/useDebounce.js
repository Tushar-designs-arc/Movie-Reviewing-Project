import { useEffect, useState } from "react";

/**
 * Returns a debounced value that only updates after the specified delay.
 * Useful for preventing excessive API calls on rapid user input.
 */
// Delay filter requests until typing pauses to avoid issuing a query for every keystroke.
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
