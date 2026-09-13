from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, constr, conlist, confloat, conint
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------- Models (bounded) ----------
ShortStr = constr(strip_whitespace=True, min_length=0, max_length=120)
MediumStr = constr(strip_whitespace=True, min_length=0, max_length=240)


class EnrollmentCreate(BaseModel):
    track_id: constr(min_length=1, max_length=40)
    program_id: constr(min_length=1, max_length=40)
    user_type: constr(min_length=1, max_length=20) = "college"
    financial_aid: bool = False
    campus: Optional[ShortStr] = None


class Enrollment(BaseModel):
    id: str
    ticket_id: str
    track_id: str
    program_id: str
    user_type: str
    financial_aid: bool
    campus: Optional[str] = None
    created_at: str


class OrderItem(BaseModel):
    id: ShortStr
    name: MediumStr
    price: confloat(ge=0, le=10_000_000)
    qty: conint(ge=1, le=1000)


class OrderCreate(BaseModel):
    items: conlist(OrderItem, min_length=1, max_length=50)
    total: confloat(ge=0, le=100_000_000)
    method: constr(min_length=1, max_length=40) = "Credit Card"


class Order(BaseModel):
    id: str
    ref_id: str
    items: List[OrderItem]
    total: float
    method: str
    created_at: str


# Note: PII fields (parent name/email/phone, student name) were removed from
# this schema in response to a security audit finding — the frontend never
# sent them and the disclaimer explicitly promises "no personal data is
# collected or stored".
class TryoutCreate(BaseModel):
    sport: constr(min_length=1, max_length=30)
    team: constr(min_length=1, max_length=80)
    documents: conint(ge=0, le=4) = 0


class Tryout(BaseModel):
    id: str
    ref_id: str
    sport: str
    team: str
    documents: int
    fee: float
    created_at: str


class BadgeCreate(BaseModel):
    course_id: constr(min_length=1, max_length=30)
    first_name: constr(min_length=0, max_length=60)
    last_name: constr(min_length=0, max_length=60)
    score: conint(ge=0, le=100)
    total: conint(ge=1, le=100)


class Badge(BaseModel):
    id: str
    badge_id: str
    course_id: str
    first_name: str
    last_name: str
    score: int
    total: int
    percent: int
    created_at: str


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Digital-UNI AI Train API", "status": "ok"}


@api_router.post("/enrollments", response_model=Enrollment)
async def create_enrollment(payload: EnrollmentCreate):
    eid = str(uuid.uuid4())
    ticket_id = f"DU-AIT-{str(uuid.uuid4())[:6].upper()}"
    doc = {
        "id": eid,
        "ticket_id": ticket_id,
        "track_id": payload.track_id,
        "program_id": payload.program_id,
        "user_type": payload.user_type,
        "financial_aid": payload.financial_aid,
        "campus": payload.campus,
        "created_at": now_iso(),
    }
    await db.enrollments.insert_one(dict(doc))
    return Enrollment(**doc)


@api_router.post("/orders", response_model=Order)
async def create_order(payload: OrderCreate):
    oid = str(uuid.uuid4())
    ref_id = f"DU-ORD-{str(uuid.uuid4())[:6].upper()}"
    doc = {
        "id": oid,
        "ref_id": ref_id,
        "items": [i.dict() for i in payload.items],
        "total": payload.total,
        "method": payload.method,
        "created_at": now_iso(),
    }
    await db.orders.insert_one(dict(doc))
    return Order(**doc)


@api_router.post("/tryouts", response_model=Tryout)
async def create_tryout(payload: TryoutCreate):
    tid = str(uuid.uuid4())
    sport_code = payload.sport[:3].upper()
    ref_id = f"DU-TRY-{sport_code}-{str(uuid.uuid4())[:4].upper()}"
    doc = {
        "id": tid,
        "ref_id": ref_id,
        "sport": payload.sport,
        "team": payload.team,
        "documents": payload.documents,
        "fee": 45.0,
        "created_at": now_iso(),
    }
    await db.tryouts.insert_one(dict(doc))
    return Tryout(**doc)


@api_router.post("/badges", response_model=Badge)
async def create_badge(payload: BadgeCreate):
    bid = str(uuid.uuid4())
    badge_id = f"DU-BADGE-{payload.course_id.upper()}-{str(uuid.uuid4())[:4].upper()}"
    percent = int(round(payload.score / max(payload.total, 1) * 100))
    doc = {
        "id": bid,
        "badge_id": badge_id,
        "course_id": payload.course_id,
        "first_name": payload.first_name,
        "last_name": payload.last_name,
        "score": payload.score,
        "total": payload.total,
        "percent": percent,
        "created_at": now_iso(),
    }
    await db.badges.insert_one(dict(doc))
    return Badge(**doc)


# Public list endpoints were removed in response to security audit SEC-001
# (unauthenticated bulk read of all stored records). Since this demo has no
# auth system, dropping the endpoints entirely is the proportional fix — the
# frontend never called them; they were only added as a convenience.


app.include_router(api_router)

# Serve locally-hosted media (videos) so the browser gets a real video/mp4
# response instead of Metro's HTML dev-server fallback. Path is /api/media/*
# so it flows through the same kubernetes ingress rule as the rest of the API.
MEDIA_DIR = ROOT_DIR / "media"
if MEDIA_DIR.exists():
    app.mount("/api/media", StaticFiles(directory=str(MEDIA_DIR)), name="media")


@app.get("/health")
async def health():
    return {"status": "ok"}


app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
