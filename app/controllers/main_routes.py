"""
app/controllers/main_routes.py
--------------------------------
Blueprint containing all page routes and error handlers.

Route names (``home``, ``projects``, ``me``, ``project_detail``,
``api_projects``) are intentionally kept identical to the old flat
``app.py`` so that every ``url_for('home')``, ``url_for('projects')`` etc.
in the Jinja templates continues to work without any template changes.
"""

import logging

from flask import Blueprint, abort, jsonify, render_template

from app.services.project_service import get_all_projects, get_project_by_id

logger = logging.getLogger(__name__)

# url_prefix=None → routes are mounted at /  (no prefix)
main_bp = Blueprint("main", __name__)

# ---------------------------------------------------------------------------
# Page routes
# ---------------------------------------------------------------------------


@main_bp.route("/")
def home():
    """Render the home / landing page."""
    return render_template("index.html", projects=get_all_projects())


@main_bp.route("/me")
def me():
    """Render the about / 'me' page."""
    return render_template("me.html")


@main_bp.route("/projects")
def projects():
    """Render the full project listing page."""
    return render_template("projects.html", projects=get_all_projects())


@main_bp.route("/project/<project_id>")
def project_detail(project_id: str):
    """Render the detail page for a single project (404 if not found)."""
    project = get_project_by_id(project_id)
    if project is None:
        abort(404)
    return render_template("project_detail.html", project=project)


@main_bp.route("/portfolio-universitaire")
def portfolio_universitaire():
    """Render the academic portfolio evaluation page."""
    import json
    import os
    from flask import current_app
    
    if not hasattr(current_app, "_academic_cache"):
        json_path = os.path.join(current_app.root_path, "data", "academic.json")
        with open(json_path, 'r', encoding='utf-8') as f:
            current_app._academic_cache = json.load(f)
            
    return render_template("portfolio_universitaire.html", data=current_app._academic_cache)

# ---------------------------------------------------------------------------
# JSON API
# ---------------------------------------------------------------------------


@main_bp.route("/api/projects")
def api_projects():
    """JSON endpoint – returns the full project list."""
    return jsonify(get_all_projects())


# ---------------------------------------------------------------------------
# Error handlers
# ---------------------------------------------------------------------------


@main_bp.app_errorhandler(404)
def page_not_found(exc):  # noqa: ANN001
    """Render the custom 404 page."""
    logger.info("404 triggered: %s", exc)
    return render_template("404.html"), 404


@main_bp.app_errorhandler(500)
def internal_server_error(exc):  # noqa: ANN001
    """Render a generic 500 error page."""
    logger.error("500 Internal Server Error: %s", exc)
    return render_template("404.html"), 500
