/**
 * Componente HotelBreakdown
 * Desglosa las métricas del agente por hotel
 */

import React from "react";
import { formatToPercentage } from "../../utils/formatting.js";

const HotelBreakdown = ({ items, isLoading }) => {
  return (
    <section className="tableBox">
      <h2>🏨 Desglose por hotel</h2>

      {isLoading && <p className="tableEmpty">Cargando…</p>}
      {!isLoading && items.length === 0 && (
        <p className="tableEmpty">Aún no hay interacciones con hotel_id registrado.</p>
      )}

      {items.length > 0 && (
        <div className="tableScroll">
          <table>
            <thead>
              <tr>
                <th>Hotel</th>
                <th>Interacciones</th>
                <th>Alucinaciones</th>
                <th>Escalados a HyperGuest</th>
                <th>CSAT prom.</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const total = item.total_interactions || 0;
                const hallucinationRate = total > 0 ? item.hallucination_count / total : 0;
                const escalationRate = total > 0 ? item.escalation_count / total : 0;
                return (
                  <tr key={item.hotel_id}>
                    <td>{item.hotel_name || item.hotel_id}</td>
                    <td>{total}</td>
                    <td>
                      {item.hallucination_count} ({formatToPercentage(hallucinationRate)})
                    </td>
                    <td>
                      {item.escalation_count} ({formatToPercentage(escalationRate)})
                    </td>
                    <td>{item.avg_csat ? Number(item.avg_csat).toFixed(2) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default HotelBreakdown;
