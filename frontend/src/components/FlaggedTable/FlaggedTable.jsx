/**
 * Componente FlaggedTable
 * Lista los casos que los hoteles marcaron como posible alucinación,
 * para que un humano los revise.
 */

import React from "react";

const formatDate = (isoString) => new Date(isoString).toLocaleString();

const FlaggedTable = ({ items, isLoading }) => {
  return (
    <section className="tableBox">
      <h2>⚠️ Casos para revisar (posibles alucinaciones)</h2>

      {isLoading && <p className="tableEmpty">Cargando…</p>}
      {!isLoading && items.length === 0 && (
        <p className="tableEmpty">Sin casos marcados por los hoteles. 🎉</p>
      )}

      {items.length > 0 && (
        <div className="tableScroll">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hotel</th>
                <th>Pregunta</th>
                <th>Respuesta del agente</th>
                <th>Comentario del hotel</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{formatDate(item.created_at)}</td>
                  <td>{item.hotel_name || item.hotel_id || "—"}</td>
                  <td>{item.user_question}</td>
                  <td>{item.agent_response}</td>
                  <td>{item.feedback_comment || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default FlaggedTable;
