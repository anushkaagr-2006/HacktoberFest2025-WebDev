"use client";

import { useState,useEffect,useRef,useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer } from "lucide-react";

export default function Home() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      const start = performance.now() - time;
      const update = () => {
        setTime(performance.now() - start);
        intervalRef.current = setTimeout(update, 10);
      };
      update();
    } else if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isRunning]);

  const startStop = () => setIsRunning((prev) => !prev);
  const reset = () => {
    setIsRunning(false);
    setTime(0);
  };

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const centiseconds = Math.floor((time % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  }, [time]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center text-gray-800">
            <Timer className="mr-2" />
            Stopwatch
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-6xl font-mono text-center mb-8 text-gray-900">
            {formattedTime}
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={startStop}
              variant={isRunning ? "destructive" : "default"}
              className="px-6"
            >
              {isRunning ? "Stop" : "Start"}
            </Button>
            <Button onClick={reset} variant="outline" className="px-6">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}