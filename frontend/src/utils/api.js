/**
 * Funciones de API
 */

import { API_BASE } from "./constants.js";

/**
 * Obtiene las métricas actuales
 * @returns {Promise<object>} Datos de métricas
 */
export const fetchMetrics = async () => {
  try {
    const response = await fetch(`${API_BASE}/metrics`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return null;
  }
};

/**
 * Envía feedback de una interacción del agente. Requiere la misma
 * X-API-Key que usa la Action del Custom GPT (FEEDBACK_API_KEY en el backend).
 * @param {object} feedbackData - Datos del feedback
 * @param {string} apiKey - Clave para el header X-API-Key
 * @returns {Promise<object>} Respuesta del servidor
 */
export const submitInteractionFeedback = async (feedbackData, apiKey) => {
  const response = await fetch(`${API_BASE}/interactions/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { "X-API-Key": apiKey } : {}),
    },
    body: JSON.stringify(feedbackData),
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(detail.detail || `Error ${response.status} al enviar feedback`);
  }

  return response.json();
};

/**
 * Obtiene las interacciones más recientes, opcionalmente filtradas por categoría
 * (por ejemplo "hallucination" para la tabla de revisión).
 * @param {string|null} category
 * @param {number} limit
 * @returns {Promise<object[]>}
 */
export const fetchRecentInteractions = async (category = null, limit = 20) => {
  const url = new URL(`${API_BASE}/interactions/recent`);
  url.searchParams.set("limit", String(limit));
  if (category) url.searchParams.set("category", category);

  const response = await fetch(url);
  if (!response.ok) return [];
  return response.json();
};

/**
 * Obtiene el desglose de métricas por hotel.
 * @returns {Promise<object[]>}
 */
export const fetchHotelBreakdown = async () => {
  const response = await fetch(`${API_BASE}/interactions/by-hotel`);
  if (!response.ok) return [];
  return response.json();
};

/**
 * Abre conexión SSE para eventos de métricas
 * @returns {EventSource} Conexión SSE
 */
export const subscribeToMetricsEvents = () => {
  return new EventSource(`${API_BASE}/events`);
};
