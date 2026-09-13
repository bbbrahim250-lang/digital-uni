from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
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


# ---------- Models ----------
class EnrollmentCreate(BaseModel):
    track_id: str
    program_id: str
    user_type: str = "college"
    financial_aid: bool = False
    campus: Optional[str] = None


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
    id: str
    name: str
    price: float
    qty: int


class OrderCreate(BaseModel):
    items: List[OrderItem]
    total: float
    method: str = "Credit Card"


class Order(BaseModel):
    id: str
    ref_id: str
    items: List[OrderItem]
    total: float
    method: str
    created_at: str


class TryoutCreate(BaseModel):
    parent_name: str = ""
    parent_email: str = ""
    parent_phone: str = ""
    student_name: str = ""
    sport: str
    team: str
    documents: int = 0


class Tryout(BaseModel):
    id: str
    ref_id: str
    sport: str
    team: str
    documents: int
    fee: float
    created_at: str


class BadgeCreate(BaseModel):
    course_id: str
    first_name: str
    last_name: str
    score: int
    total: int


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


@api_router.get("/enrollments", response_model=List[Enrollment])
async def list_enrollments():
    items = await db.enrollments.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return [Enrollment(**i) for i in items]


@api_router.get("/orders", response_model=List[Order])
async def list_orders():
    items = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return [Order(**i) for i in items]


app.include_router(api_router)


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
