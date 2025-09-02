from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import date
from decimal import Decimal
import enum

from .user import User  # Importación necesaria para la relación

class CategoryType(str, enum.Enum):
    INCOME = "income"
    EXPENSE = "expense"

class Category(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    type: CategoryType

    user_id: int = Field(index=True, foreign_key="user.id")
    user: User = Relationship(back_populates="categories")

    transactions: List["Transaction"] = Relationship(back_populates="category")

class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    amount: Decimal = Field(max_digits=10, decimal_places=2)
    tx_date: date
    note: str = ""

    user_id: int = Field(index=True, foreign_key="user.id")
    user: User = Relationship(back_populates="transactions")

    category_id: Optional[int] = Field(default=None, index=True, foreign_key="category.id")
    category: Optional[Category] = Relationship(back_populates="transactions")