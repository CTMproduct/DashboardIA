from __future__ import annotations

import asyncio
import json
import logging
import os
from datetime import datetime, timezone
from typing import Any, Literal

from fastapi import Depends, FastAPI, HTTPException, Query, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from pydantic import BaseModel, Field
from starlette.responses import StreamingResponse
from supabase import Client, create_client

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_ROLE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
FEEDBACK_API_KEY = os.environ["FEEDBACK_API_KEY"]

TABLE = "agent_interactions"

logger = logging.getLogger("interaction_metrics_api")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

app = FastAPI(title="Interaction Metrics API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


def require_api_key(key: str | None = Security(api_key_header)) -> None:
    if key != FEEDBACK_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing X-API-Key")


class AgentInteractionIn(BaseModel):
    hotel_id: str | None = None
    hotel_name: str | None = None
    conversation_id: str | None = None
    channel: str = "chatgpt_custom_gpt"

    user_question: str
    agent_response: str

    feedback_rating: Literal["positive", "negative", "neutral"] | None = None
    feedback_category: (
        Literal[
            "accurate_helpful",
            "hallucination",
            "incomplete",
            "irrelevant",
            "needs_human",
            "other",
        ]
        | None
    ) = None
    feedback_comment: str | None = None

    escalated_to_human: bool = False
    escalation_target: str | None = None
    escalation_reason: str | None = None

    resolved: bool | None = None
    response_time_seconds: float | None = Field(default=None, ge=0)
    csat_score: float | None = Field(default=None, ge=1, le=5)

    metadata: dict[str, Any] = Field(default_factory=dict)


subscribers: list[asyncio.Queue[str]] = []


def _sse_event(event: str, payload: dict[str, Any]) -> str:
    return f"event: {event}\ndata: {json.dumps(payload)}\n\n"


def _compute_metrics(rows: list[dict[str, Any]]) -> dict[str, Any]:
    total = len(rows)
    if total == 0:
        return {
            "total_interactions": 0,
            "resolution_rate": 0.0,
            "avg_response_time_seconds": 0.0,
            "avg_csat": 0.0,
            "escalation_rate": 0.0,
            "hallucination_rate": 0.0,
            "positive_rate": 0.0,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }

    resolved = sum(1 for r in rows if r.get("resolved"))
    escalated = sum(1 for r in rows if r.get("escalated_to_human"))
    hallucinations = sum(1 for r in rows if r.get("feedback_category") == "hallucination")
    positive = sum(1 for r in rows if r.get("feedback_rating") == "positive")

    response_times = [r["response_time_seconds"] for r in rows if r.get("response_time_seconds") is not None]
    csat_scores = [r["csat_score"] for r in rows if r.get("csat_score") is not None]

    return {
        "total_interactions": total,
        "resolution_rate": resolved / total,
        "avg_response_time_seconds": (sum(response_times) / len(response_times)) if response_times else 0.0,
        "avg_csat": (sum(csat_scores) / len(csat_scores)) if csat_scores else 0.0,
        "escalation_rate": escalated / total,
        "hallucination_rate": hallucinations / total,
        "positive_rate": positive / total,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }


def _fetch_metrics() -> dict[str, Any]:
    try:
        response = supabase.table(TABLE).select(
            "resolved,escalated_to_human,feedback_category,feedback_rating,response_time_seconds,csat_score"
        ).execute()
        return _compute_metrics(response.data)
    except Exception:
        logger.exception("Failed to fetch metrics from Supabase")
        return _compute_metrics([])


async def _broadcast_metrics() -> None:
    metrics = await asyncio.to_thread(_fetch_metrics)
    message = _sse_event("metrics", metrics)
    dead: list[asyncio.Queue[str]] = []
    for queue in subscribers:
        try:
            queue.put_nowait(message)
        except asyncio.QueueFull:
            dead.append(queue)
    for queue in dead:
        subscribers.remove(queue)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/metrics")
def get_metrics() -> dict[str, Any]:
    return _fetch_metrics()


@app.get("/interactions/by-hotel")
def get_metrics_by_hotel() -> list[dict[str, Any]]:
    try:
        response = supabase.table("agent_metrics_by_hotel").select("*").execute()
        return response.data
    except Exception:
        logger.exception("Failed to fetch hotel breakdown from Supabase")
        return []


@app.get("/interactions/recent")
def get_recent_interactions(
    limit: int = Query(default=50, ge=1, le=200),
    category: str | None = None,
) -> list[dict[str, Any]]:
    try:
        query = supabase.table(TABLE).select("*").order("created_at", desc=True).limit(limit)
        if category:
            query = query.eq("feedback_category", category)
        return query.execute().data
    except Exception:
        logger.exception("Failed to fetch recent interactions from Supabase")
        return []


@app.post("/interactions/feedback", dependencies=[Depends(require_api_key)])
async def receive_feedback(payload: AgentInteractionIn) -> dict[str, Any]:
    row = payload.model_dump()
    try:
        await asyncio.to_thread(lambda: supabase.table(TABLE).insert(row).execute())
    except Exception:
        logger.exception("Failed to insert interaction into Supabase")
        raise HTTPException(status_code=502, detail="Could not persist feedback")
    await _broadcast_metrics()
    return {"ok": True, "metrics": await asyncio.to_thread(_fetch_metrics)}


@app.get("/events")
async def events() -> StreamingResponse:
    queue: asyncio.Queue[str] = asyncio.Queue(maxsize=100)
    subscribers.append(queue)

    async def stream():
        try:
            yield _sse_event("connected", {"ok": True})
            initial_metrics = await asyncio.to_thread(_fetch_metrics)
            yield _sse_event("metrics", initial_metrics)
            while True:
                message = await queue.get()
                yield message
        finally:
            if queue in subscribers:
                subscribers.remove(queue)

    return StreamingResponse(stream(), media_type="text/event-stream")
