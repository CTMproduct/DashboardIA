/**
 * Hook personalizado para gestionar métricas
 */

import { useEffect, useState } from "react";
import { fetchMetrics, subscribeToMetricsEvents } from "../utils/api.js";

export const useMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeMetrics = async () => {
      try {
        setIsLoading(true);
        const initialMetrics = await fetchMetrics();
        setMetrics(initialMetrics);
      } catch (err) {
        setError(err);
        console.error("Error initializing metrics:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeMetrics();

    // Subscribe to real-time updates
    const eventSource = subscribeToMetricsEvents();

    eventSource.addEventListener("metrics", (event) => {
      try {
        const updatedMetrics = JSON.parse(event.data);
        setMetrics(updatedMetrics);
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 500);
      } catch (err) {
        console.error("Error parsing metrics event:", err);
      }
    });

    eventSource.addEventListener("error", (err) => {
      console.error("SSE connection error:", err);
      setError(err);
    });

    return () => {
      eventSource.close();
    };
  }, []);

  return { metrics, isFlashing, isLoading, error };
};
