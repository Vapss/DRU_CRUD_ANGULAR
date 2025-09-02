# ===== Base con deps =====
FROM python:3.11-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    POETRY_VERSION=1.8.3
WORKDIR /app
# Si usas requirements.txt, reemplaza este bloque por pip install -r
RUN pip install --no-cache-dir "poetry==$POETRY_VERSION"
COPY pyproject.toml poetry.lock* ./
RUN poetry config virtualenvs.create false && poetry install --no-interaction --no-ansi

# ===== Runtime =====
FROM python:3.11-slim AS runtime
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY --from=base /usr/local /usr/local
COPY app ./app
EXPOSE 8000
# Entradas por entorno
ARG MODE=prod
ENV MODE=$MODE
# CMD se define en compose para dev/prod
