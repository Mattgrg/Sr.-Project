from flask import Flask
from app.api import backend_api

app = Flask(__name__)

app.register_blueprint(backend_api)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
