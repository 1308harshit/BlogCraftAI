from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from uuid import uuid4
from typing import Any, Dict, Optional

app = FastAPI(title="BlogCraft AI Service", version="0.1.0")


class JobRequest(BaseModel):
    type: str
    payload: Dict[str, Any] = {}


class JobStatus(BaseModel):
    id: str
    type: str
    status: str
    result: Optional[Dict[str, Any]] = None


JOBS: Dict[str, JobStatus] = {}


@app.get("/health")
def health():
    return {"status": "ok", "service": "ai-service"}


@app.post("/jobs", response_model=JobStatus)
def create_job(req: JobRequest):
    job_id = str(uuid4())
    job = JobStatus(id=job_id, type=req.type, status="queued", result=None)
    JOBS[job_id] = job
    # Phase 7 scaffolding: replace with Redis queue + worker process.
    return job


@app.get("/jobs/{job_id}", response_model=JobStatus)
def get_job(job_id: str):
    job = JOBS.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

