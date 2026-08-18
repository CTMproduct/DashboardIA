/**
 * Utilidades de formateo
 */

/**
 * Convierte un número a porcentaje
 * @param {number} value - Valor entre 0 y 1
 * @returns {string} Porcentaje formateado (ej: "75%")
 */
export const formatToPercentage = (value) => {
  return `${Math.round(value * 100)}%`;
};

/**
 * Formatea un número a dos decimales
 * @param {number} value - Número a formatear
 * @returns {string} Número formateado
 */
export const formatToTwoDecimals = (value) => {
  return Number(value).toFixed(2);
};

/**
 * Formatea tiempo en segundos a formato legible
 * @param {number} seconds - Tiempo en segundos
 * @returns {string} Tiempo formateado
 */
export const formatTimeSeconds = (seconds) => {
  if (seconds < 1) return `${Math.round(seconds * 1000)}ms`;
  return `${seconds.toFixed(2)}s`;
};

/**
 * Formatea métrica genérica
 * @param {number} value - Valor a formatear
 * @param {string} type - Tipo de metrica ('percentage', 'decimal', 'integer')
 * @returns {string} Valor formateado
 */
export const formatMetric = (value, type = "decimal") => {
  switch (type) {
    case "percentage":
      return formatToPercentage(value);
    case "decimal":
      return formatToTwoDecimals(value);
    case "integer":
      return Math.round(value).toString();
    default:
      return value.toString();
  }
};

/**
 * Formatea el valor de una métrica del dashboard según su tipo declarado
 * en metricDefinitions (percentage, score5, seconds).
 * @param {number|null|undefined} value
 * @param {string} type
 * @returns {string}
 */
export const formatMetricValue = (value, type) => {
  if (value === null || value === undefined) return "—";
  switch (type) {
    case "percentage":
      return formatToPercentage(value);
    case "score5":
      return `${formatToTwoDecimals(value)} / 5`;
    case "seconds":
      return formatTimeSeconds(value);
    default:
      return formatToTwoDecimals(value);
  }
};
