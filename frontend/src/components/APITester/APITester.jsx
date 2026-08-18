/**
 * Componente APITester
 * Formulario para simular el feedback que enviaría el Custom GPT
 * (útil para probar el flujo antes de conectar el agente real)
 */

import React from "react";
import { feedbackCategoryOptions } from "../../utils/constants.js";

const APITester = ({
  feedbackData,
  apiKey,
  onFieldChange,
  onApiKeyChange,
  onSubmit,
  isSubmitting,
  submitError,
  submitSuccess,
}) => {
  return (
    <section className="testerBox">
      <h3>🧪 Simulador de feedback (X-API-Key requerida)</h3>

      {submitError && <div className="errorMessage">{submitError}</div>}
      {submitSuccess && <div className="successMessage">✓ Feedback enviado correctamente</div>}

      <form className="testerGrid" onSubmit={onSubmit}>
        <label>
          API Key (FEEDBACK_API_KEY)
          <input
            type="password"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="pega aquí la clave del backend"
            required
          />
        </label>

        <label>
          Hotel
          <input
            type="text"
            value={feedbackData.hotel_name}
            onChange={(e) => onFieldChange("hotel_name", e.target.value)}
            placeholder="Hotel Dann Cartagena"
          />
        </label>

        <label>
          Pregunta del hotel
          <input
            type="text"
            value={feedbackData.user_question}
            onChange={(e) => onFieldChange("user_question", e.target.value)}
            required
          />
        </label>

        <label>
          Respuesta del agente
          <input
            type="text"
            value={feedbackData.agent_response}
            onChange={(e) => onFieldChange("agent_response", e.target.value)}
            required
          />
        </label>

        <label>
          Feedback del hotel
          <select
            value={feedbackData.feedback_rating}
            onChange={(e) => onFieldChange("feedback_rating", e.target.value)}
          >
            <option value="positive">👍 Positivo</option>
            <option value="negative">👎 Negativo</option>
            <option value="neutral">😐 Neutral</option>
          </select>
        </label>

        <label>
          Categoría
          <select
            value={feedbackData.feedback_category}
            onChange={(e) => onFieldChange("feedback_category", e.target.value)}
          >
            {feedbackCategoryOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Comentario del hotel
          <input
            type="text"
            value={feedbackData.feedback_comment}
            onChange={(e) => onFieldChange("feedback_comment", e.target.value)}
          />
        </label>

        <label>
          Resuelto por el agente
          <input
            type="checkbox"
            checked={feedbackData.resolved}
            onChange={(e) => onFieldChange("resolved", e.target.checked)}
          />
        </label>

        <label>
          Escalado a humano
          <input
            type="checkbox"
            checked={feedbackData.escalated_to_human}
            onChange={(e) => onFieldChange("escalated_to_human", e.target.checked)}
          />
        </label>

        {feedbackData.escalated_to_human && (
          <label>
            Escalado a (ej. hyperguest)
            <input
              type="text"
              value={feedbackData.escalation_target}
              onChange={(e) => onFieldChange("escalation_target", e.target.value)}
              placeholder="hyperguest"
            />
          </label>
        )}

        <label>
          Tiempo respuesta (s)
          <input
            type="number"
            min="0"
            step="0.1"
            value={feedbackData.response_time_seconds}
            onChange={(e) => onFieldChange("response_time_seconds", Number(e.target.value))}
          />
        </label>

        <label>
          CSAT (1-5)
          <input
            type="range"
            min="1"
            max="5"
            step="0.1"
            value={feedbackData.csat_score}
            onChange={(e) => onFieldChange("csat_score", Number(e.target.value))}
          />
          <span className="rangeValue">{feedbackData.csat_score.toFixed(1)}</span>
        </label>

        <button type="submit" disabled={isSubmitting} className="submitButton">
          {isSubmitting ? "Enviando..." : "Enviar feedback"}
        </button>
      </form>
    </section>
  );
};

export default APITester;
