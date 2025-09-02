from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import auth, budgets, habits
from app.core.config import settings
from app.db.session import create_db_and_tables

# --- Creación de la aplicación ---
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# --- Inicializar base de datos al arrancar ---
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# --- Configuración de CORS ---
# Permite que el frontend (ej. Angular en localhost:4200) se comunique con el backend.
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# --- Router principal de la API v1 ---
# Agrupa todos los endpoints bajo el prefijo /api/v1
api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(budgets.router, prefix="/budgets", tags=["budgets"])
api_router.include_router(habits.router, prefix="/habits", tags=["habits"])

app.include_router(api_router, prefix=settings.API_V1_STR)


# --- Endpoint raíz para verificación ---
@app.get("/", tags=["Root"])
def read_root():
    """Endpoint de verificación de estado."""
    return {"status": "ok"}
