"""
app/__init__.py
---------------
Application Factory.
Call ``create_app()`` to get a configured Flask instance.
"""

import logging
import os

from dotenv import load_dotenv
from flask import Flask

# Load .env before anything else so os.environ is populated.
# In Docker, actual env-vars always take precedence over .env.
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)


def create_app() -> Flask:
    """Create and configure the Flask application.

    Flask auto-discovers ``templates/`` and ``static/`` relative to this
    package directory (``app/``), so no explicit paths are needed.
    """
    app = Flask(__name__)

    # ------------------------------------------------------------------
    # Configuration
    # ------------------------------------------------------------------
    app.secret_key = os.environ.get("SECRET_KEY", "change-me-in-production")

    # ------------------------------------------------------------------
    # Blueprints
    # ------------------------------------------------------------------
    from app.controllers.main_routes import main_bp  # noqa: PLC0415

    app.register_blueprint(main_bp)

    return app
