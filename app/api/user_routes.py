from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.api.auth_routes import validation_errors_to_error_messages
from app.forms.change_user_form import ChangeUserForm
from app.models import User
from app.models import db, User, Message, Channel, Server, Membership

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    user = User.query.get(id)
    return user.to_dict()


@user_routes.route('/me/update', methods=["POST"])
@login_required
def update_user():
    form = ChangeUserForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # user = User.query.get(current_user.id)
        if current_user.check_password(form['password'].data):
            current_user.username = form['username'].data
            db.session.commit()
            return current_user.to_dict()
        else:
            return {'errors': ["bad password"]}, 401
    else:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401
