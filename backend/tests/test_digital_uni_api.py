"""Backend API tests for Digital-UNI AI Train endpoints."""
import os
import pytest
import requests

BASE_URL = os.environ.get("EXPO_PUBLIC_BACKEND_URL", "https://learn-build-belong.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---- Health ----
class TestHealth:
    def test_root(self, api):
        r = api.get(f"{API}/")
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "ok"
        assert "Digital-UNI" in data.get("message", "")


# ---- Enrollments ----
class TestEnrollments:
    def test_create_enrollment(self, api):
        payload = {
            "track_id": "track-aiml",
            "program_id": "prof",
            "user_type": "college",
            "financial_aid": False,
            "campus": "Main",
        }
        r = api.post(f"{API}/enrollments", json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["track_id"] == "track-aiml"
        assert d["program_id"] == "prof"
        assert d["ticket_id"].startswith("DU-AIT-")
        assert d["id"]
        assert d["created_at"]

    def test_list_enrollments_contains_created(self, api):
        payload = {"track_id": "track-cyber", "program_id": "exec"}
        c = api.post(f"{API}/enrollments", json=payload)
        assert c.status_code == 200
        new_id = c.json()["id"]
        r = api.get(f"{API}/enrollments")
        assert r.status_code == 200
        ids = [e["id"] for e in r.json()]
        assert new_id in ids

    def test_enrollment_missing_required(self, api):
        r = api.post(f"{API}/enrollments", json={"track_id": "track-aiml"})
        assert r.status_code == 422


# ---- Orders ----
class TestOrders:
    def test_create_order(self, api):
        payload = {
            "items": [
                {"id": "tk-halloween", "name": "TEST_Halloween Tier 1", "price": 25.0, "qty": 2},
                {"id": "tk-apparel", "name": "TEST_AI Hoodie", "price": 65.0, "qty": 1},
            ],
            "total": 115.0,
            "method": "Bitcoin",
        }
        r = api.post(f"{API}/orders", json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["ref_id"].startswith("DU-ORD-")
        assert d["method"] == "Bitcoin"
        assert d["total"] == 115.0
        assert len(d["items"]) == 2

    def test_list_orders(self, api):
        r = api.get(f"{API}/orders")
        assert r.status_code == 200
        assert isinstance(r.json(), list)


# ---- Tryouts ----
class TestTryouts:
    def test_create_tryout(self, api):
        payload = {
            "parent_name": "TEST_Parent",
            "parent_email": "t@t.com",
            "student_name": "TEST_Student",
            "sport": "Basketball",
            "team": "Varsity",
            "documents": 3,
        }
        r = api.post(f"{API}/tryouts", json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["sport"] == "Basketball"
        assert d["fee"] == 45.0
        assert d["ref_id"].startswith("DU-TRY-BAS-")


# ---- Badges ----
class TestBadges:
    def test_create_badge(self, api):
        payload = {
            "course_id": "aiml",
            "first_name": "TEST",
            "last_name": "User",
            "score": 8,
            "total": 10,
        }
        r = api.post(f"{API}/badges", json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["percent"] == 80
        assert d["badge_id"].startswith("DU-BADGE-AIML-")
