import os
import sys
from fastapi.testclient import TestClient
import pytest
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.pool import StaticPool

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.main import app
from app.db.deps import get_session


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session):
    def get_session_override():
        yield session

    app.dependency_overrides[get_session] = get_session_override
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


def test_register_login_and_category_flow(client):
    # Register a new user
    register_data = {
        "email": "user@example.com",
        "password": "secret",
        "full_name": "User Test",
    }
    r = client.post("/api/v1/auth/register", json=register_data)
    assert r.status_code == 200
    assert r.json()["email"] == register_data["email"]

    # Login with the new user
    login_data = {"email": register_data["email"], "password": register_data["password"]}
    r = client.post("/api/v1/auth/login", json=login_data)
    assert r.status_code == 200
    token = r.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # List categories - should be empty initially
    r = client.get("/api/v1/budgets/categories", headers=headers)
    assert r.status_code == 200
    assert r.json() == []

    # Create a new category
    category_data = {"name": "Food", "type": "expense"}
    r = client.post("/api/v1/budgets/categories", json=category_data, headers=headers)
    assert r.status_code == 201
    category_id = r.json()["id"]

    # Retrieve categories again and check the new category is present
    r = client.get("/api/v1/budgets/categories", headers=headers)
    assert r.status_code == 200
    categories = r.json()
    assert any(cat["id"] == category_id and cat["name"] == "Food" for cat in categories)
