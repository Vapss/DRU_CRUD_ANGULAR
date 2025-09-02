from sqlmodel import SQLModel
from typing import Optional
from pydantic import EmailStr

# --- Schemas base para User ---

class UserBase(SQLModel):
    """Schema base para usuarios."""
    email: EmailStr
    full_name: Optional[str] = None
    is_active: bool = True

class UserCreate(SQLModel):
    """Schema para crear un nuevo usuario (registro)."""
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserRead(UserBase):
    """Schema para leer un usuario desde la API."""
    id: int

class UserUpdate(SQLModel):
    """Schema para actualizar un usuario (todos los campos opcionales)."""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None

# --- Schemas para autenticación ---

class UserLogin(SQLModel):
    """Schema para el login de usuario."""
    email: EmailStr
    password: str

class UserRegister(SQLModel):
    """Schema para el registro de usuario."""
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class Token(SQLModel):
    """Schema para la respuesta del token."""
    access_token: str
    token_type: str = "bearer"

class TokenData(SQLModel):
    """Schema para los datos del token."""
    email: Optional[str] = None

# --- Schemas para respuestas ---

class UserResponse(SQLModel):
    """Schema para respuestas de usuario (sin datos sensibles)."""
    id: int
    email: str
    full_name: Optional[str] = None
    is_active: bool

class RegisterResponse(SQLModel):
    """Schema para la respuesta del registro."""
    message: str
    email: str
