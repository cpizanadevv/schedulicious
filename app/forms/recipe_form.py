from flask_wtf import FlaskForm
from wtforms import StringField,IntegerField, TimeField
from wtforms.validators import DataRequired, Length, NumberRange

class RecipeForm(FlaskForm):
    meal_name = StringField('Meal', validators=[DataRequired(),Length(min=2,max=25)])
    prep_time = TimeField('Prep Time', validators=[DataRequired()])
    cook_time = TimeField('Cook Time', validators=[DataRequired()])
    serving_size = IntegerField('Serving Size', validators=[DataRequired(),NumberRange(min=1,max=50)])
    calories = IntegerField('Calories', validators=[DataRequired(),NumberRange(min=1)])
    img = StringField('Image', validators=[DataRequired()])
    
    
