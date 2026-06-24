"""
app/services/project_service.py
--------------------------------
Business-logic layer for loading and querying project data.

All file I/O is isolated here so controllers stay thin and testable.
"""

import json
import logging
import os
from typing import Dict, List, Optional

from flask import current_app

logger = logging.getLogger(__name__)


def _load_projects() -> List[Dict]:
    """Read ``data/projects.json`` relative to the Flask app root.

    ``current_app.root_path`` always resolves to the directory that contains
    the ``app`` package (i.e. ``/app/`` inside Docker), so the path is
    correct whether the project is run locally or inside a container.

    Returns an empty list on any I/O or parse error.
    """
    json_path = os.path.join(current_app.root_path, "data", "projects.json")
    
    # Fallback paths for Docker and local dev if root_path is weird
    if not os.path.exists(json_path):
        alt_path = "/app/app/data/projects.json"
        if os.path.exists(alt_path):
            json_path = alt_path
    
    try:
        with open(json_path, "r", encoding="utf-8") as fh:
            data = json.load(fh)
            print(f"DEBUG: Successfully loaded {len(data)} projects from {json_path}")
            return data
    except Exception as exc:
        print(f"CRITICAL ERROR LOADING PROJECTS from {json_path}: {exc}")
        logger.error("Error loading projects: %s", exc)
    return []


def get_all_projects() -> List[Dict]:
    """Return the full list of projects.

    Data is loaded once per request context and cached on ``current_app``
    so repeated calls within the same request are free.
    """
    if not hasattr(current_app, "_projects_cache"):
        current_app._projects_cache = _load_projects()  # type: ignore[attr-defined]
    return current_app._projects_cache  # type: ignore[attr-defined]


def get_project_by_id(project_id: str) -> Optional[Dict]:
    """Return a single project dict matching ``project_id``, or ``None``."""
    return next(
        (p for p in get_all_projects() if p.get("id") == project_id),
        None,
    )
