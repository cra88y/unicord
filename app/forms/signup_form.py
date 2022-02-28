from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User
from wtforms.fields.html5 import EmailField


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')


def password_matches(form, field):
    password = form.password.data
    repeatPassword = field.data
    if password != repeatPassword:
        raise ValidationError('Passwords do not match.')


class SignUpForm(FlaskForm):
    username = StringField(
        'username', validators=[DataRequired(), username_exists])
    email = EmailField('email', validators=[
        DataRequired(), user_exists, Email()])
    password = StringField('password', validators=[DataRequired()])
    repeatPassword = StringField('repeatPassword', validators=[
                                 DataRequired(), password_matches])
