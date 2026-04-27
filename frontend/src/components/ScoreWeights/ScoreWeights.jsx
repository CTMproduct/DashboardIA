/**
 * Componente ScoreWeights
 * Muestra la tabla de pesos del scoring
 */

import React from "react";

const ScoreWeights = ({ weights }) => {
  return (
    <section className="weightsBox">
      <h2>PESOS DEL SCORE PONDERADO — ENTERPRISE 2025–2026</h2>
      <div className="weightsGrid">
        {weights.map(([title, weight, description, color]) => (
          <article
            key={title}
            className="weightItem"
            style={{ borderLeftColor: color }}
          >
            <h4>
              {title} <span>{weight}</span>
            </h4>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ScoreWeights;
