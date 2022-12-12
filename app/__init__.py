import logging
import os
from flask import Flask, render_template, request, session, redirect
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager
import eventlet
from flask_socketio import SocketIO, send
from .seeds import seed_commands
from .models import db, User
from .config import Config
eventlet.monkey_patch()
app = Flask(__name__, static_folder='static', static_url_path='/')
app.app_context().push()

# seed commands
app.cli.add_command(seed_commands)

app.config.from_object(Config)
db.init_app(app)
db.create_all()
migrate = Migrate(app, db)

# session = Session(app)
# Application Security
CORS(app)
# Setup login manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'

# SocketIO
socketio = SocketIO(app, cors_allowed_origins="*", manage_session=True)

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


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    if path == 'favicon.ico':
        return app.send_static_file('favicon.ico')
    return app.send_static_file('index.html')


if __name__ == '__main__':
    from flask_migrate import upgrade
    upgrade()
    app.run()
    socketio.run(app)
    
