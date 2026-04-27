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
 * Envía feedback de interacción
 * @param {object} feedbackData - Datos del feedback
 * @returns {Promise<object>} Respuesta del servidor
 */
export const submitInteractionFeedback = async (feedbackData) => {
  try {
    const response = await fetch(`${API_BASE}/interactions/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedbackData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
};

/**
 * Abre conexión SSE para eventos de métricas
 * @returns {EventSource} Conexión SSE
 */
export const subscribeToMetricsEvents = () => {
  return new EventSource(`${API_BASE}/events`);
};
