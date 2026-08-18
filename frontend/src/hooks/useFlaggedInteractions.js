/**
 * Hook para casos marcados como alucinación y desglose por hotel
 */

import { useCallback, useEffect, useState } from "react";
import { fetchHotelBreakdown, fetchRecentInteractions } from "../utils/api.js";

const REFRESH_INTERVAL_MS = 20000;

export const useFlaggedInteractions = () => {
  const [flagged, setFlagged] = useState([]);
  const [byHotel, setByHotel] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [flaggedData, hotelData] = await Promise.all([
        fetchRecentInteractions("hallucination"),
        fetchHotelBreakdown(),
      ]);
      setFlagged(flaggedData);
      setByHotel(hotelData);
    } catch (error) {
      console.error("Error fetching flagged interactions:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  return { flagged, byHotel, isLoading, refresh };
};
