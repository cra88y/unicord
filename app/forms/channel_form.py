from wsgiref.validate import validator
from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired


class ChannelForm(FlaskForm):
    server_id = IntegerField("server_id", validators=[DataRequired()])
    name = StringField(
        'username', validators=[DataRequired()])
