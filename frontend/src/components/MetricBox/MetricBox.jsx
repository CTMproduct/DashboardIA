/**
 * Componente MetricBox
 * Muestra una métrica individual con su valor y descripción
 */

import React from "react";

const MetricBox = ({ value, label, icon }) => {
  return (
    <div className="metricBox">
      <strong>{value}</strong>
      <span>{label}</span>
      {icon && <div className="metricBoxIcon">{icon}</div>}
    </div>
  );
};

export default MetricBox;
