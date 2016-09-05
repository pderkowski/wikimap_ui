from flask_wtf import Form
from wtforms import StringField
from wtforms.validators import DataRequired

class SearchBox(Form):
    query = StringField('query', validators=[DataRequired()])