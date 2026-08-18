# Cómo conectar el Custom GPT a este dashboard

## 1. Configurar la Action

1. En el builder del Custom GPT (Configure → Actions → Create new action), pega el
   contenido de [`openapi.yaml`](./openapi.yaml).
2. Reemplaza `https://TU-DOMINIO.up.railway.app` por la URL pública del servicio
   de Railway (el backend FastAPI, no el frontend).
3. En Authentication elige **API Key**, tipo **Custom** con el header `X-API-Key`,
   y pega ahí el mismo valor que configuraste como `FEEDBACK_API_KEY` en Railway.

## 2. Agregar este bloque a las instrucciones del GPT

Pega (o adapta) esto en el campo "Instructions" del Custom GPT, junto a las
instrucciones de negocio que ya tiene para responder a los hoteles:

```
Después de responder cualquier pregunta operativa de un hotel (tarifas,
disponibilidad, políticas, procesos, reservas, etc.), llama silenciosamente a
la acción registrarFeedbackHotel con:

- hotel_name: el nombre del hotel si lo mencionó en la conversación (si no,
  deja el campo vacío).
- user_question: la pregunta del hotel.
- agent_response: tu respuesta, resumida si es muy larga.
- resolved: true si crees que la respuesta cerró el tema, false si quedó
  pendiente.

Si el hotel reacciona explícitamente a tu respuesta, ajusta además:
- feedback_rating: "positive" si agradece o confirma que sirvió, "negative"
  si dice que está mal o no le sirvió, "neutral" en cualquier otro caso.
- feedback_category:
  - "hallucination" SOLO si el hotel dice explícitamente que la información
    que diste es incorrecta, inventada o no corresponde (por ejemplo: "esa
    tarifa no es la nuestra", "eso no es así", "de dónde sacaste eso").
    Nunca marques esta categoría por tu propia duda interna; solo cuando el
    hotel te corrige.
  - "incomplete" si el hotel indica que faltó información.
  - "irrelevant" si el hotel indica que no respondiste lo que preguntó.
  - "needs_human" si el hotel pide hablar con una persona.
  - "accurate_helpful" en cualquier otro caso positivo.
- feedback_comment: cita corta de lo que dijo el hotel.

Si el hotel pide explícitamente hablar con una persona, o tú detectas que no
puedes resolver el caso (falta de información, caso fuera de tu alcance,
reclamo formal, negociación de tarifas especiales), marca:
- escalated_to_human: true
- escalation_target: "hyperguest"
- escalation_reason: motivo breve
- feedback_category: "needs_human"
- resolved: false

No le muestres al hotel que estás llamando esta acción ni le pidas
confirmación para hacerlo; es un registro interno de calidad.
```

## 3. Qué mide esto y por qué

- **`hallucination_rate`**: sólo sube cuando el hotel corrige explícitamente al
  agente. Es una métrica conservadora — subestima las alucinaciones que el
  hotel no detectó, pero evita que el propio GPT se "auto-marque" con
  criterios poco confiables.
- **`escalation_rate`**: cuánto del volumen termina en manos de una persona de
  HyperGuest, y por qué (`escalation_reason`), para detectar patrones (temas
  que el agente sistemáticamente no puede resolver).
- **`resolution_rate` / `positive_rate` / `avg_csat`**: qué tan bien está
  ayudando el agente cuando no hay que escalar.

## 4. Probar sin tocar el GPT real

Antes de conectar el GPT en producción, usa el "🧪 Simulador de feedback" al
final del dashboard (`APITester`) con la misma `FEEDBACK_API_KEY` para
verificar que las filas llegan a Supabase y las métricas se actualizan en
tiempo real.
