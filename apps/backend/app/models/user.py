from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List

# Importaciones necesarias para evitar referencias circulares con typing
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from .budget import Category, Transaction

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    full_name: Optional[str] = None
    hashed_password: str
    is_active: bool = True

    categories: List["Category"] = Relationship(back_populates="user")
    transactions: List["Transaction"] = Relationship(back_populates="user")