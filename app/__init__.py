"""Flask application factory for the Interactive Hotel Booking User Portal."""

from flask import Flask


def create_app() -> Flask:
    """Create and configure the Flask application."""
    app = Flask(
        __name__,
        template_folder="templates",
        static_folder="static",
    )
    app.config["SECRET_KEY"] = "dev-only-not-a-secret"  # no auth; local UI only

    from app.routes import bp

    app.register_blueprint(bp)
    return app
