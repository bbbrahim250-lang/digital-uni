"""Backend API tests for Digital-UNI AI Train endpoints.

Post security-audit hardening pass (SEC-001): the public GET list endpoints
for enrollments/orders were removed. Tests updated to assert those routes are
no longer reachable (405 Method Not Allowed since only POST is defined).
Also: /api/tryouts payload no longer contains parent/student PII fields, and
POST bodies now enforce bounded lengths / item-array caps -> validation tests
assert 422 on oversized/negative inputs.
"""
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
    def test_root_api(self, api):
        r = api.get(f"{API}/")
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "ok"
        assert "Digital-UNI" in data.get("message", "")

    def test_health_endpoint(self, api):
        # /health has no /api prefix; the k8s ingress only routes /api/* to the
        # backend, so externally this path is served by the frontend. Hit the
        # backend directly on its internal supervisor port for a truthful check.
        r = api.get("http://localhost:8001/health")
        assert r.status_code == 200
        assert r.json() == {"status": "ok"}


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

    def test_enrollment_missing_required(self, api):
        r = api.post(f"{API}/enrollments", json={"track_id": "track-aiml"})
        assert r.status_code == 422

    def test_list_enrollments_removed_sec001(self, api):
        """SEC-001: bulk read of enrollments must no longer be reachable."""
        r = api.get(f"{API}/enrollments")
        assert r.status_code in (404, 405), f"expected 404/405, got {r.status_code}: {r.text}"


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

    def test_list_orders_removed_sec001(self, api):
        """SEC-001: bulk read of orders must no longer be reachable."""
        r = api.get(f"{API}/orders")
        assert r.status_code in (404, 405), f"expected 404/405, got {r.status_code}: {r.text}"

    def test_order_oversized_items_array_rejected(self, api):
        """conlist max_length=50 must reject 51-item carts with 422."""
        items = [
            {"id": f"tk-{i}", "name": f"TEST_Item {i}", "price": 1.0, "qty": 1}
            for i in range(51)
        ]
        payload = {"items": items, "total": 51.0, "method": "Credit Card"}
        r = api.post(f"{API}/orders", json=payload)
        assert r.status_code == 422, r.text

    def test_order_negative_price_rejected(self, api):
        payload = {
            "items": [{"id": "tk-neg", "name": "TEST_Neg", "price": -5.0, "qty": 1}],
            "total": 0.0,
            "method": "Credit Card",
        }
        r = api.post(f"{API}/orders", json=payload)
        assert r.status_code == 422, r.text

    def test_order_zero_qty_rejected(self, api):
        payload = {
            "items": [{"id": "tk-zero", "name": "TEST_Zero", "price": 10.0, "qty": 0}],
            "total": 0.0,
            "method": "Credit Card",
        }
        r = api.post(f"{API}/orders", json=payload)
        assert r.status_code == 422, r.text

    def test_order_empty_items_rejected(self, api):
        payload = {"items": [], "total": 0.0, "method": "Credit Card"}
        r = api.post(f"{API}/orders", json=payload)
        assert r.status_code == 422, r.text


# ---- Tryouts ----
class TestTryouts:
    def test_create_tryout_reduced_payload(self, api):
        """Post-audit payload: no more parent/student PII fields."""
        payload = {
            "sport": "Basketball",
            "team": "Varsity",
            "documents": 3,
        }
        r = api.post(f"{API}/tryouts", json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["sport"] == "Basketball"
        assert d["team"] == "Varsity"
        assert d["documents"] == 3
        assert d["fee"] == 45.0
        assert d["ref_id"].startswith("DU-TRY-BAS-")

    def test_tryout_documents_bounded(self, api):
        payload = {"sport": "Soccer", "team": "JV", "documents": 99}
        r = api.post(f"{API}/tryouts", json=payload)
        assert r.status_code == 422, r.text


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

    def test_create_passing_badge_from_course_flow(self, api):
        """Simulates the AI+ML course flow submitting a passing score (5/5)."""
        payload = {
            "course_id": "aiml",
            "first_name": "TEST_Ada",
            "last_name": "Lovelace",
            "score": 5,
            "total": 5,
        }
        r = api.post(f"{API}/badges", json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["percent"] == 100
        assert d["badge_id"].startswith("DU-BADGE-AIML-")
        assert d["first_name"] == "TEST_Ada"
        assert d["last_name"] == "Lovelace"
        assert d["score"] == 5
        assert d["total"] == 5
