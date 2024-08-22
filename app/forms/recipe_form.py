from flask_wtf import FlaskForm
from wtforms import StringField,IntegerField, TimeField,SelectField,TextAreaField
from wtforms.validators import DataRequired, Length, NumberRange, URL, Optional

class RecipeForm(FlaskForm):
    meal_name = StringField('Meal', validators=[DataRequired(),Length(min=2,max=25)])
    course_type = SelectField('Course Type',choices=['Breakfast','Lunch', 'Dinner', ''] ,validators=[DataRequired(),])
    prep_time = TimeField('Prep Time', validators=[DataRequired()])
    cook_time = TimeField('Cook Time', validators=[DataRequired()])
    serving_size = IntegerField('Serving Size', validators=[DataRequired(),NumberRange(min=1,max=50)])
    calories = IntegerField('Calories', validators=[DataRequired(),NumberRange(min=1)])
    img = StringField('Image', validators=[DataRequired(), URL(message="Invalid URL.")])
    ingredients = StringField('Ingredients', validators=[DataRequired()])
    instructions = TextAreaField('Instructions', validators=[DataRequired()])
    tags = StringField('Tags', validators=[Optional()])
    
    
    
