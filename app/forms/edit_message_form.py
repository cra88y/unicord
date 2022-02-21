from wsgiref.validate import validator
from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired


class EditMessageForm(FlaskForm):
    id = IntegerField("id", validators=[DataRequired()])
    body = StringField(
        'body', validators=[DataRequired()])
