import logging
import os
from time import strftime
from flask import Flask, render_template, request, session, redirect
from flask_cors import CORS
from flask_migrate import Migrate, upgrade
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager
import eventlet
from flask_socketio import SocketIO, send
from .models import db, User
from .config import Config
from dotenv import load_dotenv
load_dotenv()
eventlet.monkey_patch()

app = Flask(__name__, static_folder='static', static_url_path='/')
app.app_context().push()

app.config.from_object(Config)

migrate = Migrate()
cors = CORS()
login = LoginManager()
socketio = SocketIO()
db.init_app(app)
migrate.init_app(app, db)

try:
    upgrade()
except Exception:
    import traceback
    print(traceback.format_exc())
    raise

cors.init_app(app)

# Setup login manager
login.init_app(app)
login.login_view = 'auth.unauthorized'

# SocketIO
socketio.init_app(app, cors_allowed_origins="*", manage_session=True)

@login.user_loader
def load_user(id):
    return User.query.get(int(id))

from .api.message_routes import message_routes
from .api.auth_routes import auth_routes
from .api.user_routes import user_routes
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(message_routes, url_prefix='/api/')

@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            code = 301
            return redirect(url, code=code)


@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get(
            'FLASK_ENV') == 'production' else None,
        httponly=True)
    return response

@app.after_request
def after_request(response):
    timestamp = strftime('[%Y-%b-%d %H:%M]')
    app.logger.error('%s %s %s %s %s %s', timestamp, request.remote_addr, request.method, request.scheme, request.full_path, response.status)
    return response


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    if path == 'favicon.ico':
        return app.send_static_file('favicon.ico')
    return app.send_static_file('index.html')

@app.errorhandler(404)   
def not_found(e):   
  return app.send_static_file('index.html')

if __name__ == '__main__':
    if os.environ.get('FLASK_ENV') == 'development':
        gunicorn_logger = logging.getLogger('gunicorn.error')
        app.logger.handlers = gunicorn_logger.handlers
        app.logger.setLevel("DEBUG")
        logging.getLogger('sqlalchemy.engine').setLevel(logging.DEBUG)
    app.run(host='0.0.0.0', port=8000, debug=True)
    socketio.run(app)