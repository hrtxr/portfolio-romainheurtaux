# ---------------------------------------------------------------------------
# docker/Dockerfile – Portfolio (Flask / No-Build frontend)
# ---------------------------------------------------------------------------
# Build context is the project ROOT (one level above this file).
# docker-compose.yml sets: context: . | dockerfile: docker/Dockerfile
# ---------------------------------------------------------------------------

FROM python:3.11-slim AS base

# ---------- System dependencies ----------
RUN apt-get update && apt-get install -y --no-install-recommends \
        curl \
    && rm -rf /var/lib/apt/lists/*

# ---------- Non-root user ----------
RUN groupadd --system appgroup \
 && useradd --system --no-create-home --gid appgroup appuser

# ---------- Working directory ----------
WORKDIR /app

# ---------- Python dependencies (cached layer) ----------
# requirements.txt is copied BEFORE source code so this layer is only
# invalidated when dependencies actually change, not on every code edit.
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

# ---------- Application source ----------
# The new package layout: run.py + app/ (contains static/ templates/ data/)
COPY run.py        ./run.py
COPY app/          ./app/

# ---------- Ownership ----------
RUN chown -R appuser:appgroup /app

# ---------- Runtime configuration ----------
# FLASK_ENV=production ensures Werkzeug's interactive debugger is NEVER
# activated, preventing stack-trace exposure on unhandled 500 errors.
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    FLASK_ENV=production \
    PORT=5000

# ---------- Drop privileges ----------
USER appuser

EXPOSE 5000

# ---------- Health check ----------
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:5000/ || exit 1

# ---------- Entrypoint ----------
CMD ["gunicorn", \
     "--workers", "2", \
     "--worker-class", "gthread", \
     "--threads", "4", \
     "--bind", "0.0.0.0:5000", \
     "--timeout", "30", \
     "--log-level", "info", \
     "--access-logfile", "-", \
     "--error-logfile", "-", \
     "run:app"]
