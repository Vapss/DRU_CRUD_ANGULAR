from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import date
from decimal import Decimal

# Importamos el Enum del modelo para mantener la consistencia
from app.models.budget import CategoryType

# --- Schemas para Category ---

class CategoryBase(SQLModel):
    """Schema base para categorías."""
    name: str
    type: CategoryType

class CategoryCreate(CategoryBase):
    """Schema para crear una nueva categoría a través de la API."""
    pass

class CategoryRead(CategoryBase):
    """Schema para leer una categoría desde la API (incluye ID)."""
    id: int
    user_id: int

class CategoryUpdate(SQLModel):
    """Schema para actualizar una categoría (todos los campos son opcionales)."""
    name: Optional[str] = None
    type: Optional[CategoryType] = None


# --- Schemas para Transaction ---

class TransactionBase(SQLModel):
    """Schema base para transacciones."""
    amount: Decimal = Field(max_digits=10, decimal_places=2)
    tx_date: date
    note: Optional[str] = ""
    category_id: Optional[int] = None

class TransactionCreate(TransactionBase):
    """Schema para crear una nueva transacción."""
    pass

class TransactionRead(TransactionBase):
    """Schema para leer una transacción desde la API."""
    id: int
    user_id: int

class TransactionUpdate(SQLModel):
    """Schema para actualizar una transacción (campos opcionales)."""
    amount: Optional[Decimal] = None
    tx_date: Optional[date] = None
    note: Optional[str] = None
    category_id: Optional[int] = None


# --- Schemas para Reportes ---

class ReportByCategory(SQLModel):
    """Schema para el desglose por categoría en un reporte."""
    category: str
    total: Decimal

class MonthReportRead(SQLModel):
    """Schema para la respuesta del reporte mensual."""
    income: Decimal
    expense: Decimal
    balance: Decimal
    byCategory: List[ReportByCategory]
