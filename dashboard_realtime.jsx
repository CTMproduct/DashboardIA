import React, { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

const initialFeedback = {
  channel: "web",
  resolved: true,
  response_time_seconds: 45,
  customer_sentiment: 0.8,
  csat_score: 4.2,
  escalated: false,
  conversation_turns: 7,
  metadata: {},
};

const agentCards = [
  {
    icon: "⚡",
    name: "GPT-4o",
    tags: ["GPT", "producción"],
    accent: "#34d399",
  },
  {
    icon: "💎",
    name: "Gemini 2.5",
    tags: ["Gema", "investigación"],
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

const scoreWeights = [
  ["CSAT", "30%", "Satisfacción directa del cliente (0–100%)", "#5eead4"],
  ["Precisión", "25%", "Calidad del output del agente (0–100%)", "#93c5fd"],
  ["Velocidad", "15%", "UX y costo operacional — ms promedio", "#fde047"],
  ["Completitud", "15%", "% de tareas resueltas sin abandono", "#f9a8d4"],
  ["Anti-Alucinación", "10%", "% sin alucinaciones", "#fb923c"],
  ["No-Escalación", "5%", "% sin escalar a humano", "#a78bfa"],
];

const formatPct = (value) => `${Math.round(value * 100)}%`;

function AgentCard({ icon, name, tags, accent, flash }) {
  return (
    <article className={`agent-card ${flash ? "flash" : ""}`}>
      <div className="agent-head">
        <span className="agent-icon">{icon}</span>
        <div>
          <h3>{name}</h3>
          <div className="chip-row">
            {tags.map((tag) => (
              <span key={tag} className="chip" style={{ borderColor: `${accent}40`, color: accent }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="agent-empty">Sin evaluación</div>
      <button className="evaluate-btn" type="button">
        📊 Evaluar
      </button>
    </article>
  );
}

export default function DashboardRealtime() {
  const [metrics, setMetrics] = useState(null);
  const [feedback, setFeedback] = useState(initialFeedback);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/metrics`)
      .then((r) => r.json())
      .then(setMetrics)
      .catch(console.error);

    const source = new EventSource(`${API_BASE}/events`);
    source.addEventListener("metrics", (event) => {
      const next = JSON.parse(event.data);
      setMetrics(next);
      setFlash(true);
      setTimeout(() => setFlash(false), 500);
    });

    return () => source.close();
  }, []);

  const counters = useMemo(() => {
    const total = metrics?.total_interactions ?? 0;
    const evaluated = Math.max(0, Math.round(total * (metrics?.resolution_rate ?? 0)));

    return {
      agents: agentCards.length,
      evaluated,
      resolution: formatPct(metrics?.resolution_rate ?? 0),
      escalated: formatPct(metrics?.escalation_rate ?? 0),
    };
  }, [metrics]);

  const submitFeedback = async (e) => {
    e.preventDefault();
    await fetch(`${API_BASE}/interactions/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedback),
    });
  };

  return (
    <main className="dashboard-root">
      <header className="hero">
        <div>
          <p className="eyebrow">ENTERPRISE AI EVAL • 2025–2026</p>
          <h1>Agent Performance Dashboard</h1>

          <div className="tabs">
            <button className="tab active" type="button">
              📄 Agentes
            </button>
            <button className="tab" type="button">
              📈 Comparativa
            </button>
            <button className="tab" type="button">
              🚀 Deploy
            </button>
          </div>
        </div>

        <div className="stat-group">
          <div className="stat-box">
            <strong>{counters.agents}</strong>
            <span>agentes</span>
          </div>
          <div className="stat-box">
            <strong>{counters.evaluated}</strong>
            <span>evaluados</span>
          </div>
          <button className="add-agent" type="button">
            + Agente
          </button>
        </div>
      </header>

      <section className="filters">
        <button className="filter active" type="button">
          Todos ({agentCards.length})
        </button>
        <button className="filter" type="button">
          ⚡ GPT (1)
        </button>
        <button className="filter" type="button">
          💎 Gema (1)
        </button>
        <button className="filter" type="button">
          🔐 Open Source (2)
        </button>
      </section>

      <section className="agent-grid">
        {agentCards.map((card) => (
          <AgentCard key={card.name} {...card} flash={flash} />
        ))}
      </section>

      <section className="weights-box">
        <h2>PESOS DEL SCORE PONDERADO — ENTERPRISE 2025–2026</h2>
        <div className="weights-grid">
          {scoreWeights.map(([title, weight, desc, color]) => (
            <article key={title} className="weight-item" style={{ borderLeftColor: color }}>
              <h4>
                {title} <span>{weight}</span>
              </h4>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="tester-box">
        <h3>🧪 API Tester (real-time)</h3>
        <form className="tester-grid" onSubmit={submitFeedback}>
          <label>
            Canal
            <select
              value={feedback.channel}
              onChange={(e) => setFeedback({ ...feedback, channel: e.target.value })}
            >
              <option value="web">web</option>
              <option value="whatsapp">whatsapp</option>
              <option value="slack">slack</option>
            </select>
          </label>

          <label>
            Resuelto
            <input
              type="checkbox"
              checked={feedback.resolved}
              onChange={(e) => setFeedback({ ...feedback, resolved: e.target.checked })}
            />
          </label>

          <label>
            Tiempo respuesta (s)
            <input
              type="number"
              min="0"
              value={feedback.response_time_seconds}
              onChange={(e) =>
                setFeedback({ ...feedback, response_time_seconds: Number(e.target.value) })
              }
            />
          </label>

          <label>
            Sentimiento (0-1)
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={feedback.customer_sentiment}
              onChange={(e) =>
                setFeedback({ ...feedback, customer_sentiment: Number(e.target.value) })
              }
            />
          </label>

          <label>
            CSAT (0-5)
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={feedback.csat_score}
              onChange={(e) => setFeedback({ ...feedback, csat_score: Number(e.target.value) })}
            />
          </label>

          <label>
            Escalado
            <input
              type="checkbox"
              checked={feedback.escalated}
              onChange={(e) => setFeedback({ ...feedback, escalated: e.target.checked })}
            />
          </label>

          <label>
            Turnos conversación
            <input
              type="number"
              min="1"
              value={feedback.conversation_turns}
              onChange={(e) =>
                setFeedback({ ...feedback, conversation_turns: Number(e.target.value) })
              }
            />
          </label>

          <button type="submit">Enviar feedback</button>
        </form>
      </section>

      <style>{`
        * {
          transition: all 0.2s ease;
        }

        .dashboard-root {
          min-height: 100vh;
          padding: 2rem;
          color: #1a202c;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdff 100%);
          font-family: 'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .hero {
          display: flex;
          justify-content: space-between;
          gap: 3rem;
          align-items: flex-start;
          margin-bottom: 3rem;
          animation: slideInDown 0.6s ease;
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .eyebrow {
          margin: 0;
          letter-spacing: 0.15em;
          font-size: 0.75rem;
          font-weight: 700;
          color: #0284c7;
          text-transform: uppercase;
        }

        h1 {
          margin: 0.5rem 0 1.5rem;
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          font-weight: 800;
          background: linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tabs {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-top: 1.5rem;
        }

        .tab {
          border: none;
          color: #64748b;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 1rem;
          padding: 0.75rem 1.25rem;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }

        .tab:hover {
          background: rgba(255, 255, 255, 0.7);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }

        .tab.active {
          background: linear-gradient(135deg, #0284c7 0%, #06b6d4 100%);
          color: white;
          box-shadow: 0 8px 25px rgba(2, 132, 199, 0.4);
        }

        .stat-group {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .stat-box {
          min-width: 100px;
          text-align: center;
          border: 2px solid rgba(255, 255, 255, 0.6);
          border-radius: 1.25rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .stat-box:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
          border-color: #0284c7;
        }

        .stat-box strong {
          display: block;
          color: #0284c7;
          font-size: 2rem;
          font-weight: 800;
        }

        .stat-box span {
          font-size: 0.85rem;
          color: #475569;
          font-weight: 600;
        }

        .add-agent {
          border: none;
          border-radius: 1rem;
          padding: 0.875rem 1.5rem;
          color: white;
          font-weight: 800;
          font-size: 0.95rem;
          background: linear-gradient(135deg, #06b6d4 0%, #0284c7 100%);
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(6, 182, 212, 0.3);
          transition: all 0.3s ease;
        }

        .add-agent:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(6, 182, 212, 0.5);
        }

        .filters {
          margin: 2rem 0;
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          animation: slideInUp 0.6s ease 0.1s both;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .filter {
          border: 2px solid rgba(2, 132, 199, 0.3);
          color: #0284c7;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 1rem;
          padding: 0.65rem 1.1rem;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .filter:hover {
          background: rgba(255, 255, 255, 0.8);
          border-color: #0284c7;
        }

        .filter.active {
          background: linear-gradient(135deg, #0284c7 0%, #06b6d4 100%);
          color: white;
          border-color: #0284c7;
          box-shadow: 0 6px 20px rgba(2, 132, 199, 0.3);
        }

        .agent-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
          animation: slideInUp 0.6s ease 0.2s both;
        }

        .agent-card {
          border: 2px solid rgba(255, 255, 255, 0.6);
          border-radius: 1.5rem;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(15px);
          padding: 1.5rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }

        .agent-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .agent-card:hover {
          transform: translateY(-8px);
          border-color: #0284c7;
          box-shadow: 0 20px 50px rgba(2, 132, 199, 0.15);
        }

        .agent-card.flash {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2), 0 20px 50px rgba(16, 185, 129, 0.15);
          animation: pulse 0.6s ease;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        .agent-head {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          position: relative;
          z-index: 1;
        }

        .agent-icon {
          font-size: 2.5rem;
          line-height: 1;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }

        .agent-card h3 {
          margin: 0;
          color: #0f172a;
          font-size: 1.35rem;
          font-weight: 700;
        }

        .chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .chip {
          border: 1.5px solid currentColor;
          border-radius: 999px;
          padding: 0.35rem 0.75rem;
          font-size: 0.8rem;
          background: rgba(255, 255, 255, 0.5);
          font-weight: 600;
          opacity: 0.85;
        }

        .agent-empty {
          margin: 1.2rem 0;
          border-radius: 1rem;
          background: linear-gradient(135deg, rgba(2, 132, 199, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%);
          color: #0284c7;
          text-align: center;
          padding: 1.2rem;
          font-weight: 600;
          border: 1.5px dashed #0284c7;
          position: relative;
          z-index: 1;
        }

        .evaluate-btn {
          width: 100%;
          border-radius: 1rem;
          border: none;
          color: white;
          background: linear-gradient(135deg, #06b6d4 0%, #0284c7 100%);
          padding: 0.85rem 1rem;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(2, 132, 199, 0.3);
          position: relative;
          z-index: 1;
          transition: all 0.3s ease;
        }

        .evaluate-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(2, 132, 199, 0.5);
        }

        .weights-box,
        .tester-box {
          margin-top: 2.5rem;
          border: 2px solid rgba(2, 132, 199, 0.2);
          border-radius: 1.5rem;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(15px);
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          animation: slideInUp 0.6s ease 0.3s both;
        }

        .weights-box h2 {
          margin: 0 0 1.5rem;
          font-size: 1.5rem;
          letter-spacing: 0.05em;
          font-weight: 800;
          color: #0f172a;
        }

        .weights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
        }

        .weight-item {
          border-left: 4px solid currentColor;
          padding-left: 1.2rem;
          padding: 1.2rem;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 1rem;
          border-left: 4px solid;
          transition: all 0.3s ease;
        }

        .weight-item:hover {
          transform: translateX(4px);
          background: rgba(255, 255, 255, 0.8);
        }

        .weight-item h4 {
          margin: 0 0 0.5rem;
          color: #0f172a;
          font-weight: 700;
          font-size: 1rem;
        }

        .weight-item h4 span {
          font-size: 0.85rem;
          margin-left: 0.5rem;
          opacity: 0.75;
        }

        .weight-item p {
          margin: 0;
          color: #475569;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .tester-box h3 {
          margin: 0 0 1.5rem;
          font-size: 1.35rem;
          font-weight: 700;
          color: #0f172a;
        }

        .tester-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.2rem;
        }

        .tester-grid label {
          display: grid;
          gap: 0.5rem;
          color: #1a202c;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .tester-grid input,
        .tester-grid select {
          border: 2px solid rgba(2, 132, 199, 0.3);
          border-radius: 1rem;
          padding: 0.875rem 1rem;
          color: #1a202c;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .tester-grid input:focus,
        .tester-grid select:focus {
          outline: none;
          border-color: #0284c7;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
          background: rgba(255, 255, 255, 0.9);
        }

        .tester-grid button {
          grid-column: span 1;
          font-weight: 700;
          cursor: pointer;
          background: linear-gradient(135deg, #06b6d4 0%, #0284c7 100%);
          color: white;
          border: none;
          border-radius: 1rem;
          padding: 0.875rem 1.5rem;
          box-shadow: 0 6px 20px rgba(2, 132, 199, 0.3);
          transition: all 0.3s ease;
          font-size: 1rem;
          font-weight: 700;
        }

        .tester-grid button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(2, 132, 199, 0.5);
        }

        @media (max-width: 768px) {
          .dashboard-root {
            padding: 1rem;
          }

          .hero {
            flex-direction: column;
            gap: 1.5rem;
          }

          .stat-group {
            justify-content: flex-start;
            width: 100%;
          }

          .agent-grid {
            grid-template-columns: 1fr;
          }

          .tester-grid {
            grid-template-columns: 1fr;
          }

          .tester-grid button {
            grid-column: auto;
          }
        }
      `}</style>
    </main>
  );
}
