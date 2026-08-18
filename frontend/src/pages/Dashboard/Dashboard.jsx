/**
 * Página del Dashboard
 * Componente principal que orquesta todos los componentes
 */

import React from "react";
import { useMetrics, useFeedback, useFlaggedInteractions } from "../../hooks/index.js";
import MetricBox from "../../components/MetricBox/index.js";
import MetricsGrid from "../../components/MetricsGrid/index.js";
import FlaggedTable from "../../components/FlaggedTable/index.js";
import HotelBreakdown from "../../components/HotelBreakdown/index.js";
import APITester from "../../components/APITester/index.js";
import { agentProfile, metricDefinitions } from "../../utils/constants.js";
import { formatToPercentage } from "../../utils/formatting.js";

const Dashboard = () => {
  const { metrics, isFlashing } = useMetrics();
  const { flagged, byHotel, isLoading: isFlaggedLoading } = useFlaggedInteractions();
  const {
    feedbackData,
    apiKey,
    updateFeedbackField,
    updateApiKey,
    handleSubmitFeedback,
    isSubmitting,
    submitError,
    submitSuccess,
  } = useFeedback();

  return (
    <main className="dashboardRoot">
      {/* Header/Hero */}
      <header className="hero">
        <div>
          <p className="eyebrow">HYPERGUEST · MONITOREO DEL AGENTE IA</p>
          <h1>
            {agentProfile.icon} {agentProfile.name}
          </h1>
          <p className="agentFullName">{agentProfile.fullName}</p>
          <div className="chipRow">
            {agentProfile.tags.map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Stats Group */}
        <div className={`statGroup ${isFlashing ? "flash" : ""}`}>
          <MetricBox value={metrics?.total_interactions ?? 0} label="interacciones" />
          <MetricBox
            value={formatToPercentage(metrics?.hallucination_rate ?? 0)}
            label="alucinaciones"
          />
          <MetricBox
            value={formatToPercentage(metrics?.escalation_rate ?? 0)}
            label="a HyperGuest"
          />
        </div>
      </header>

      {/* Métricas reales */}
      <MetricsGrid definitions={metricDefinitions} metrics={metrics} />

      {/* Casos marcados como alucinación, para revisión humana */}
      <FlaggedTable items={flagged} isLoading={isFlaggedLoading} />

      {/* Desglose por hotel */}
      <HotelBreakdown items={byHotel} isLoading={isFlaggedLoading} />

      {/* Simulador de feedback para pruebas */}
      <APITester
        feedbackData={feedbackData}
        apiKey={apiKey}
        onFieldChange={updateFeedbackField}
        onApiKeyChange={updateApiKey}
        onSubmit={handleSubmitFeedback}
        isSubmitting={isSubmitting}
        submitError={submitError}
        submitSuccess={submitSuccess}
      />
    </main>
  );
};

export default Dashboard;
