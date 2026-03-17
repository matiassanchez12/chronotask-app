import { useState, useEffect } from "react";
import { format } from "date-fns";

export default function Clock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = format(now, "HH:mm:ss");

  return (
    <p className="text-xl font-mono text-stone-600 dark:text-stone-300">
      {timeString}
    </p>
  );
}