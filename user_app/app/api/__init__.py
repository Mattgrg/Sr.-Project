from flask import Blueprint

backend_api = Blueprint("backend_api", __name__)

from . import user_app_backend
