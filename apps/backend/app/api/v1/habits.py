from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def list_habits():
    return {"message": "Habits endpoint - Coming soon"}
