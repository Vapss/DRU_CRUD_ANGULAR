from app.db.session import SessionLocal
from sqlmodel import Session

def get_session():
    with SessionLocal() as session:
        yield session
