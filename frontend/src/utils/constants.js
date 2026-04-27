/**
 * Configuración global del Dashboard
 */

// API Configuration
export const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

// Agent Configuration
export const agentConfigs = [
  {
    icon: "⚡",
    name: "GPT-4o",
    tags: ["GPT", "producción"],
    accent: "#34d399",
  },
  {
    icon: "💎",
    name: "Gemini 2.5",
    tags: ["Gemini", "investigación"],
    accent: "#60a5fa",
  },
  {
    icon: "🔐",
    name: "Mixtral 8x22",
    tags: ["Open Source", "local"],
    accent: "#fb923c",
  },
  {
    icon: "🤖",
    name: "Hermes 3",
    tags: ["Open Source", "fine-tuned"],
    accent: "#f472b6",
  },
];

// Score Weights Configuration
export const scoreWeightConfigs = [
  ["CSAT", "30%", "Satisfacción directa del cliente (0–100%)", "#5eead4"],
  ["Precisión", "25%", "Calidad del output del agente (0–100%)", "#93c5fd"],
  ["Velocidad", "15%", "UX y costo operacional — ms promedio", "#fde047"],
  ["Completitud", "15%", "% de tareas resueltas sin abandono", "#f9a8d4"],
  ["Anti-Alucinación", "10%", "% sin alucinaciones", "#fb923c"],
  ["No-Escalación", "5%", "% sin escalar a humano", "#a78bfa"],
];

// Initial Feedback Data
export const initialFeedbackData = {
  channel: "web",
  resolved: true,
  response_time_seconds: 45,
  customer_sentiment: 0.8,
  csat_score: 4.2,
  escalated: false,
  conversation_turns: 7,
  metadata: {},
};

// Filter Options
export const filterOptions = [
  { label: "Todos", count: agentConfigs.length },
  { label: "⚡ GPT", count: 1 },
  { label: "💎 Gemini", count: 1 },
  { label: "🔐 Open Source", count: 2 },
];

// Tab Options
export const tabOptions = [
  { id: "agents", label: "📄 Agentes", active: true },
  { id: "comparison", label: "📈 Comparativa", active: false },
  { id: "deploy", label: "🚀 Deploy", active: false },
];
