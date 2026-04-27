/**
 * Componente AgentCard
 * Card que muestra información de un agente IA
 */

import React from "react";

const AgentCard = ({ icon, name, tags, accent, isFlashing, onEvaluate }) => {
  const cardClassName = `agentCard ${isFlashing ? "flash" : ""}`;
  
  return (
    <article className={cardClassName}>
      <div className="agentHead">
        <span className="agentIcon">{icon}</span>
        <div>
          <h3>{name}</h3>
          <div className="chipRow">
            {tags.map((tag) => (
              <span
                key={tag}
                className="chip"
                style={{
                  borderColor: `${accent}40`,
                  color: accent,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="agentEmpty">Sin evaluación</div>
      <button
        className="evaluateBtn"
        type="button"
        onClick={onEvaluate}
        title={`Evaluar agente ${name}`}
      >
        📊 Evaluar
      </button>
    </article>
  );
};

export default AgentCard;
