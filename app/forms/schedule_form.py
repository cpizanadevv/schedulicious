from flask_wtf import FlaskForm
from wtforms import DateField,SelectField
from wtforms.validators import DataRequired

class ScheduleForm(FlaskForm):
    start_date = DateField('Start Date', validators=[DataRequired()])
    
class ScheduleMealsForm(FlaskForm):
    day_of_week = SelectField('Day of the Week', choices=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], validators=[DataRequired()])