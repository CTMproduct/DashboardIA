/**
 * Componente APITester
 * Formulario para enviar feedback de prueba a la API
 */

import React from "react";

const APITester = ({
  feedbackData,
  onFieldChange,
  onSubmit,
  isSubmitting,
  submitError,
  submitSuccess,
}) => {
  return (
    <section className="testerBox">
      <h3>🧪 API Tester (real-time)</h3>
      
      {submitError && <div className="errorMessage">{submitError}</div>}
      {submitSuccess && <div className="successMessage">✓ Feedback enviado correctamente</div>}
      
      <form className="testerGrid" onSubmit={onSubmit}>
        <label>
          Canal
          <select
            value={feedbackData.channel}
            onChange={(e) => onFieldChange("channel", e.target.value)}
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
            checked={feedbackData.resolved}
            onChange={(e) => onFieldChange("resolved", e.target.checked)}
          />
        </label>

        <label>
          Tiempo respuesta (s)
          <input
            type="number"
            min="0"
            step="0.1"
            value={feedbackData.response_time_seconds}
            onChange={(e) =>
              onFieldChange("response_time_seconds", Number(e.target.value))
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
            value={feedbackData.customer_sentiment}
            onChange={(e) =>
              onFieldChange("customer_sentiment", Number(e.target.value))
            }
          />
          <span className="rangeValue">
            {feedbackData.customer_sentiment.toFixed(2)}
          </span>
        </label>

        <label>
          CSAT (0-5)
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={feedbackData.csat_score}
            onChange={(e) => onFieldChange("csat_score", Number(e.target.value))}
          />
          <span className="rangeValue">{feedbackData.csat_score.toFixed(1)}</span>
        </label>

        <label>
          Escalado
          <input
            type="checkbox"
            checked={feedbackData.escalated}
            onChange={(e) => onFieldChange("escalated", e.target.checked)}
          />
        </label>

        <label>
          Turnos conversación
          <input
            type="number"
            min="1"
            value={feedbackData.conversation_turns}
            onChange={(e) =>
              onFieldChange("conversation_turns", Number(e.target.value))
            }
          />
        </label>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="submitButton"
        >
          {isSubmitting ? "Enviando..." : "Enviar feedback"}
        </button>
      </form>
    </section>
  );
};

export default APITester;
