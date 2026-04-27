/**
 * Página del Dashboard
 * Componente principal que orquesta todos los componentes
 */

import React, { useMemo } from "react";
import { useMetrics, useFeedback } from "../../hooks/index.js";
import AgentCard from "../../components/AgentCard/index.js";
import MetricBox from "../../components/MetricBox/index.js";
import ScoreWeights from "../../components/ScoreWeights/index.js";
import APITester from "../../components/APITester/index.js";
import {
  agentConfigs,
  scoreWeightConfigs,
  filterOptions,
  tabOptions,
} from "../../utils/constants.js";
import { formatToPercentage } from "../../utils/formatting.js";

const Dashboard = () => {
  const { metrics, isFlashing } = useMetrics();
  const {
    feedbackData,
    updateFeedbackField,
    handleSubmitFeedback,
    isSubmitting,
    submitError,
    submitSuccess,
  } = useFeedback();

  // Calcular contadores
  const counters = useMemo(() => {
    const totalInteractions = metrics?.total_interactions ?? 0;
    const evaluatedCount = Math.max(
      0,
      Math.round(totalInteractions * (metrics?.resolution_rate ?? 0))
    );

    return {
      agentsCount: agentConfigs.length,
      evaluatedCount,
      resolutionRate: formatToPercentage(metrics?.resolution_rate ?? 0),
      escalationRate: formatToPercentage(metrics?.escalation_rate ?? 0),
    };
  }, [metrics]);

  const handleTabClick = (tabId) => {
    console.log(`Tab clicked: ${tabId}`);
    // TODO: Implementar navegación entre tabs
  };

  const handleFilterClick = (filterIndex) => {
    console.log(`Filter clicked: ${filterIndex}`);
    // TODO: Implementar filtrado
  };

  const handleAddAgent = () => {
    console.log("Add agent clicked");
    // TODO: Implementar agregar agente
  };

  const handleEvaluateAgent = (agentName) => {
    console.log(`Evaluate agent: ${agentName}`);
    // TODO: Implementar evaluar agente
  };

  return (
    <main className="dashboardRoot">
      {/* Header/Hero */}
      <header className="hero">
        <div>
          <p className="eyebrow">ENTERPRISE AI EVAL • 2025–2026</p>
          <h1>Agent Performance Dashboard</h1>

          {/* Tabs */}
          <div className="tabs">
            {tabOptions.map((tab) => (
              <button
                key={tab.id}
                className={`tab ${tab.active ? "active" : ""}`}
                type="button"
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Group */}
        <div className="statGroup">
          <MetricBox value={counters.agentsCount} label="agentes" />
          <MetricBox value={counters.evaluatedCount} label="evaluados" />
          <button
            className="addAgent"
            type="button"
            onClick={handleAddAgent}
            title="Agregar nuevo agente"
          >
            + Agente
          </button>
        </div>
      </header>

      {/* Filters */}
      <section className="filters">
        {filterOptions.map((filter, index) => (
          <button
            key={index}
            className={`filter ${index === 0 ? "active" : ""}`}
            type="button"
            onClick={() => handleFilterClick(index)}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </section>

      {/* Agent Grid */}
      <section className="agentGrid">
        {agentConfigs.map((agent) => (
          <AgentCard
            key={agent.name}
            {...agent}
            isFlashing={isFlashing}
            onEvaluate={() => handleEvaluateAgent(agent.name)}
          />
        ))}
      </section>

      {/* Score Weights */}
      <ScoreWeights weights={scoreWeightConfigs} />

      {/* API Tester */}
      <APITester
        feedbackData={feedbackData}
        onFieldChange={updateFeedbackField}
        onSubmit={handleSubmitFeedback}
        isSubmitting={isSubmitting}
        submitError={submitError}
        submitSuccess={submitSuccess}
      />
    </main>
  );
};

export default Dashboard;
