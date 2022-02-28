from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired


class ChangeUserAvatarForm(FlaskForm):
    url = StringField(
        'url')
