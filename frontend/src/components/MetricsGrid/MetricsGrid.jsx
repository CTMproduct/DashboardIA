/**
 * Componente MetricsGrid
 * Muestra las métricas reales del agente calculadas en el backend
 */

import React from "react";
import { formatMetricValue } from "../../utils/formatting.js";

const MetricsGrid = ({ definitions, metrics }) => {
  return (
    <section className="weightsBox">
      <h2>MÉTRICAS DEL AGENTE — TIEMPO REAL</h2>
      <div className="weightsGrid">
        {definitions.map(([key, title, description, color, type]) => (
          <article key={key} className="weightItem" style={{ borderLeftColor: color }}>
            <h4>
              {title} <span style={{ color }}>{formatMetricValue(metrics?.[key], type)}</span>
            </h4>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default MetricsGrid;
