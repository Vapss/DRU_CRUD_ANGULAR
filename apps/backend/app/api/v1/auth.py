from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlmodel import Session, select

from app.core.config import settings
from app.core.security import verify_password, get_password_hash, create_access_token
from app.db.deps import get_session
from app.models.user import User

router = APIRouter()
security = HTTPBearer()

class UserLogin:
    def __init__(self, email: str, password: str):
        self.email = email
        self.password = password

class UserRegister:
    def __init__(self, email: str, password: str, full_name: str = None):
        self.email = email
        self.password = password
        self.full_name = full_name

@router.post("/login")
def login(user_data: dict, session: Session = Depends(get_session)):
    email = user_data.get("email")
    password = user_data.get("password")
    
    user = session.exec(select(User).where(User.email == email)).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register")
def register(user_data: dict, session: Session = Depends(get_session)):
    email = user_data.get("email")
    password = user_data.get("password")
    full_name = user_data.get("full_name")
    
    # Verificar si el usuario ya existe
    existing_user = session.exec(select(User).where(User.email == email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Crear nuevo usuario
    hashed_password = get_password_hash(password)
    user = User(
        email=email,
        hashed_password=hashed_password,
        full_name=full_name,
        is_active=True
    )
    
    session.add(user)
    session.commit()
    session.refresh(user)
    
    return {"message": "User created successfully", "email": user.email}
