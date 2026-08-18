# Integración API + Supabase + Dashboard en tiempo real

## Arquitectura

```
Custom GPT (hoteles)  ──POST /interactions/feedback (X-API-Key)──▶  FastAPI (Railway)
                                                                          │
                                                                          ▼
                                                                     Supabase (Postgres)
                                                                          ▲
                                                                          │
Dashboard React  ◀──GET /metrics, /interactions/recent, /interactions/by-hotel, SSE /events──
```

El backend FastAPI es el único componente que habla con Supabase (usa la
`service_role key`, nunca expuesta al navegador). El dashboard solo habla con
el backend.

## 1. Crear la tabla en Supabase

Abre el SQL Editor de tu proyecto de Supabase y ejecuta
[`supabase/schema.sql`](./supabase/schema.sql). Crea:

- `agent_interactions`: cada pregunta/respuesta con su feedback.
- `agent_metrics_summary` (vista): métricas agregadas globales.
- `agent_metrics_by_hotel` (vista): desglose por hotel.

RLS está habilitado sin políticas públicas: solo la `service_role key` (que
usa el backend) puede leer/escribir. El navegador nunca toca Supabase
directamente.

## 2. Variables de entorno del backend

En Railway (Settings → Variables) del servicio de la API:

| Variable | De dónde sale |
|---|---|
| `SUPABASE_URL` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` (secreta, no la `anon`) |
| `FEEDBACK_API_KEY` | La inventas tú (ej. genera un UUID). Es la clave que usará el Custom GPT y el simulador del dashboard para poder escribir feedback. |

Sin estas tres variables el backend no arranca (falla rápido con un error
claro en vez de guardar en memoria y perder todo al reiniciar, que era el
comportamiento anterior).

## 3. Backend (FastAPI)

```bash
pip install -r requirements.txt
export SUPABASE_URL=...
export SUPABASE_SERVICE_ROLE_KEY=...
export FEEDBACK_API_KEY=...
uvicorn api_main:app --reload --port 8000
```

Endpoints:

- `GET /health`
- `GET /metrics` — métricas agregadas globales
- `GET /interactions/recent?limit=50&category=hallucination` — interacciones
  recientes, opcionalmente filtradas por categoría (útil para la tabla de
  revisión de posibles alucinaciones)
- `GET /interactions/by-hotel` — desglose por hotel
- `POST /interactions/feedback` (requiere header `X-API-Key`) — registra una
  interacción
- `GET /events` (Server-Sent Events) — el dashboard se refresca solo cuando
  llega feedback nuevo

## 4. Frontend (Vite + React)

```bash
cd frontend
npm install
VITE_API_BASE=http://localhost:8000 npm run dev
```

## 5. Deploy local en 1 comando

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... FEEDBACK_API_KEY=... docker-compose up --build
```

## 6. Deploy en Railway (API)

1. Sube este repositorio a GitHub (ya está en `CTMproduct/DashboardIA`).
2. En el proyecto de Railway, agrega las tres variables de entorno del paso 2.
3. Railway detecta `railway.toml` y ejecuta:
   `uvicorn api_main:app --host 0.0.0.0 --port $PORT`
4. Despliega el frontend (`frontend/`) como un segundo servicio en Railway o
   en cualquier hosting estático, con `VITE_API_BASE` apuntando a la URL
   pública del backend.
5. Ajusta `allow_origins` en `api_main.py` si quieres restringir CORS al
   dominio del dashboard en vez de `"*"`.

> ⚠️ El dashboard hoy no tiene su propio login. Si las preguntas/respuestas de
> los hoteles son sensibles, considera ponerlo detrás de algo como Railway
> private networking, Cloudflare Access, o una pantalla de login simple antes
> de compartir la URL ampliamente.

## 7. Conectar el Custom GPT de hoteles

Ver [`gpt-action/openapi.yaml`](./gpt-action/openapi.yaml) y
[`gpt-action/INSTRUCCIONES_GPT.md`](./gpt-action/INSTRUCCIONES_GPT.md) para el
schema de la Action y las instrucciones de sistema que debe usar el GPT para
registrar feedback, posibles alucinaciones y escalamientos a HyperGuest.

## Snippet Python (para probar sin el GPT)

```python
import requests

payload = {
    "hotel_name": "Hotel Dann Cartagena",
    "user_question": "¿Cuál es el horario de check-in?",
    "agent_response": "El check-in es a partir de las 3:00 PM.",
    "feedback_rating": "positive",
    "feedback_category": "accurate_helpful",
    "resolved": True,
    "response_time_seconds": 4.2,
}

requests.post(
    "https://TU-API.up.railway.app/interactions/feedback",
    json=payload,
    headers={"X-API-Key": "TU_FEEDBACK_API_KEY"},
    timeout=10,
)
```
