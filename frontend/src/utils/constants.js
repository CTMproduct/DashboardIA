/**
 * Configuración global del Dashboard
 */

// API Configuration
export const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

// Perfil del agente que se está midiendo (Custom GPT de HyperGuest)
export const agentProfile = {
  icon: "📈",
  name: "NORA",
  fullName: "Net Optimization & Revenue Assistant",
  tags: ["HyperGuest", "Revenue Management", "Custom GPT"],
};

// Definición de métricas reales calculadas por el backend a partir de Supabase
// [key, título, descripción, color, tipo de formato]
export const metricDefinitions = [
  [
    "hallucination_rate",
    "Posibles alucinaciones",
    "% de respuestas que el hotel marcó como información incorrecta o inventada",
    "#fb923c",
    "percentage",
  ],
  [
    "escalation_rate",
    "Asistencia humana (HyperGuest)",
    "% de conversaciones que el agente escaló a una persona de HyperGuest",
    "#a78bfa",
    "percentage",
  ],
  [
    "resolution_rate",
    "Resueltas sin escalar",
    "% de conversaciones que terminaron resueltas por el agente sin intervención humana",
    "#5eead4",
    "percentage",
  ],
  [
    "positive_rate",
    "Feedback positivo",
    "% de respuestas que el hotel marcó explícitamente como útiles",
    "#34d399",
    "percentage",
  ],
  [
    "avg_csat",
    "CSAT promedio",
    "Satisfacción reportada por los hoteles en una escala de 1 a 5",
    "#93c5fd",
    "score5",
  ],
  [
    "avg_response_time_seconds",
    "Tiempo de respuesta",
    "Promedio en segundos hasta que el agente responde",
    "#fde047",
    "seconds",
  ],
];

// Opciones de categoría de feedback (coinciden con el check constraint de Supabase)
export const feedbackCategoryOptions = [
  ["accurate_helpful", "✅ Correcta y útil"],
  ["hallucination", "⚠️ Alucinación / info incorrecta"],
  ["incomplete", "🟡 Incompleta"],
  ["irrelevant", "❌ No entendió la pregunta"],
  ["needs_human", "🙋 Pidió persona (HyperGuest)"],
  ["other", "Otro"],
];

// Datos iniciales del formulario de prueba (API Tester)
export const initialFeedbackData = {
  hotel_id: "",
  hotel_name: "",
  conversation_id: "",
  channel: "chatgpt_custom_gpt",
  user_question: "",
  agent_response: "",
  feedback_rating: "positive",
  feedback_category: "accurate_helpful",
  feedback_comment: "",
  escalated_to_human: false,
  escalation_target: "",
  escalation_reason: "",
  resolved: true,
  response_time_seconds: 12,
  csat_score: 4.5,
  metadata: {},
};
