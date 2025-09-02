from fastapi import APIRouter, Depends, Query
from sqlmodel import select, Session, func
from datetime import date
from calendar import monthrange

from app.db.deps import get_session
from app.core.security import get_current_user
from app.models.budget import Category, Transaction
from app.models.user import User
from app.schemas.budget import CategoryCreate, TransactionCreate

router = APIRouter(tags=["budgets"])

def _get_month_range(year: int, month: int) -> tuple[date, date]:
    """Devuelve las fechas de inicio y fin para un año y mes dados."""
    last_day = monthrange(year, month)[1]
    start_date = date(year, month, 1)
    end_date = date(year, month, last_day)
    return start_date, end_date

@router.get("/categories")
def list_categories(s: Session = Depends(get_session), user: User = Depends(get_current_user)):
    return s.exec(select(Category).where(Category.user_id == user.id)).all()

@router.post("/categories", status_code=201)
def create_category(cat_data: CategoryCreate, s: Session = Depends(get_session), user: User = Depends(get_current_user)):
    cat = Category(**cat_data.dict(), user_id=user.id)
    s.add(cat)
    s.commit()
    s.refresh(cat)
    return cat

@router.get("/transactions")
def list_transactions(
    year: int | None = None,
    month: int | None = None,
    s: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    q = select(Transaction).where(Transaction.user_id == user.id)
    if year and month:
        start, end = _get_month_range(year, month)
        q = q.where(Transaction.tx_date.between(start, end))
    return s.exec(q).all()

@router.post("/transactions", status_code=201)
def create_tx(tx_data: TransactionCreate, s: Session = Depends(get_session), user: User = Depends(get_current_user)):
    tx = Transaction(**tx_data.dict(), user_id=user.id)
    s.add(tx)
    s.commit()
    s.refresh(tx)
    return tx

@router.get("/reports/month")
def month_report(
    year: int = Query(...),
    month: int = Query(...),
    s: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    start, end = _get_month_range(year, month)

    # Usar agregaciones de SQL para eficiencia
    income_expense = s.exec(
        select(
            func.sum(func.iif(Transaction.amount > 0, Transaction.amount, 0)),
            func.sum(func.iif(Transaction.amount < 0, -Transaction.amount, 0))
        ).where(
            Transaction.user_id == user.id,
            Transaction.tx_date.between(start, end)
        )
    ).one()
    
    total_income = income_expense[0] or 0
    total_expense = income_expense[1] or 0

    # Agrupar por categoría en la base de datos
    by_cat_query = s.exec(
        select(Category.name, func.sum(Transaction.amount))
        .join(Category, isouter=True)
        .where(
            Transaction.user_id == user.id,
            Transaction.tx_date.between(start, end)
        )
        .group_by(Category.name)
    )
    
    by_cat = [{"category": name if name else "Otros", "total": total} for name, total in by_cat_query]

    return {
        "income": total_income,
        "expense": total_expense,
        "balance": total_income - total_expense,
        "byCategory": by_cat,
    }