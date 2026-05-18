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
from flask_talisman import Talisman

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

    # Sécurisation des cookies de session
    app.config["SESSION_COOKIE_SECURE"] = True
    app.config["SESSION_COOKIE_HTTPONLY"] = True
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"

    # ------------------------------------------------------------------
    # Security Headers (Talisman)
    # ------------------------------------------------------------------
    # On désactive force_https par défaut pour éviter de casser le localhost 
    # (car Docker utilise FLASK_ENV=production). À activer via .env en prod !
    force_https = os.environ.get("FORCE_HTTPS", "False").lower() == "true"
    
    csp = {
        'default-src': ["'self'", 'https:', 'data:'],
        'script-src': ["'self'", 'https:', "'unsafe-inline'", "'unsafe-eval'"],
        'style-src': ["'self'", 'https:', "'unsafe-inline'"],
        'img-src': ["'self'", 'https:', 'data:'],
        'font-src': ["'self'", 'https:', 'data:']
    }
    
    Talisman(
        app,
        content_security_policy=csp,
        force_https=force_https,
        session_cookie_secure=app.config["SESSION_COOKIE_SECURE"]
    )

    # ------------------------------------------------------------------
    # Blueprints
    # ------------------------------------------------------------------
    from app.controllers.main_routes import main_bp  # noqa: PLC0415

    app.register_blueprint(main_bp)

    return app
