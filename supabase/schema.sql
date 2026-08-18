-- DashboardIA — esquema Supabase para métricas del agente de hoteles
-- Ejecutar en el SQL Editor de Supabase (proyecto del dashboard).

create extension if not exists "pgcrypto";

create table if not exists agent_interactions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Identificación del hotel/conversación
  hotel_id text,
  hotel_name text,
  conversation_id text,
  channel text not null default 'chatgpt_custom_gpt',

  -- Contenido de la interacción (para poder auditar alucinaciones)
  user_question text,
  agent_response text,

  -- Feedback explícito del hotel
  feedback_rating text check (feedback_rating in ('positive', 'negative', 'neutral')),
  feedback_category text check (feedback_category in (
    'accurate_helpful',   -- respondió bien y ayudó
    'hallucination',      -- info incorrecta / inventada
    'incomplete',         -- le faltó información
    'irrelevant',         -- no entendió la pregunta
    'needs_human',        -- el hotel pidió humano aunque el bot no haya fallado
    'other'
  )),
  feedback_comment text,

  -- Escalamiento a asistencia humana
  escalated_to_human boolean not null default false,
  escalation_target text,     -- ej. 'hyperguest'
  escalation_reason text,

  -- Métricas operativas
  resolved boolean,
  response_time_seconds numeric check (response_time_seconds >= 0),
  csat_score numeric check (csat_score between 1 and 5),

  metadata jsonb not null default '{}'::jsonb
);

create index if not exists idx_agent_interactions_created_at
  on agent_interactions (created_at desc);
create index if not exists idx_agent_interactions_hotel
  on agent_interactions (hotel_id);
create index if not exists idx_agent_interactions_category
  on agent_interactions (feedback_category);
create index if not exists idx_agent_interactions_escalated
  on agent_interactions (escalated_to_human);

-- Solo el backend (service_role key) escribe y lee; sin políticas públicas.
alter table agent_interactions enable row level security;

-- Vista de métricas agregadas globales (ventana configurable desde el backend con WHERE)
create or replace view agent_metrics_summary as
select
  count(*) as total_interactions,
  count(*) filter (where feedback_rating = 'positive') as positive_count,
  count(*) filter (where feedback_rating = 'negative') as negative_count,
  count(*) filter (where feedback_category = 'hallucination') as hallucination_count,
  count(*) filter (where escalated_to_human) as escalation_count,
  count(*) filter (where resolved) as resolved_count,
  avg(csat_score) as avg_csat,
  avg(response_time_seconds) as avg_response_time_seconds,
  round(
    (count(*) filter (where feedback_category = 'hallucination'))::numeric
    / nullif(count(*), 0), 4
  ) as hallucination_rate,
  round(
    (count(*) filter (where escalated_to_human))::numeric
    / nullif(count(*), 0), 4
  ) as escalation_rate,
  round(
    (count(*) filter (where resolved))::numeric
    / nullif(count(*), 0), 4
  ) as resolution_rate
from agent_interactions;

-- Desglose por hotel
create or replace view agent_metrics_by_hotel as
select
  hotel_id,
  hotel_name,
  count(*) as total_interactions,
  count(*) filter (where feedback_category = 'hallucination') as hallucination_count,
  count(*) filter (where escalated_to_human) as escalation_count,
  avg(csat_score) as avg_csat,
  max(created_at) as last_interaction_at
from agent_interactions
where hotel_id is not null
group by hotel_id, hotel_name
order by total_interactions desc;
