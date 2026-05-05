"""
run.py
------
Minimal development entry point.
In production, gunicorn imports this module and uses the ``app`` object directly.

Usage (dev):
    python run.py

Usage (production via gunicorn – see docker/Dockerfile):
    gunicorn -w 4 -b 0.0.0.0:5000 run:app
"""

import os

from app import create_app

app = create_app()

if __name__ == "__main__":
    debug_mode = os.environ.get("FLASK_ENV", "production") == "development"
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=debug_mode)
