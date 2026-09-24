"""Flask application factory for the Interactive Hotel Booking User Portal."""

from flask import Flask


def create_app() -> Flask:
    """Create and configure the Flask application."""
    app = Flask(
        __name__,
        template_folder="templates",
        static_folder="static",
    )
    # No Flask sessions/auth; do not set a SECRET_KEY (no secrets in source).

    from app.routes import bp

    app.register_blueprint(bp)
    return app
