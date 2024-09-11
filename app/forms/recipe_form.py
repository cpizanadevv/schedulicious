from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SelectField, TextAreaField, FormField
from wtforms.validators import DataRequired, Length, NumberRange, URL, Optional
from .aws_form import ImageForm



class RecipeForm(FlaskForm):
    meal_name = StringField("Meal", validators=[DataRequired(), Length(min=2, max=200)])
    course_type = SelectField(
        "Course Type",
        choices=["Breakfast", "Lunch", "Dinner", "Snack", "Drink"],
        validators=[DataRequired()],
    )
    prep_time = StringField("Prep Time", validators=[DataRequired()])
    cook_time = StringField("Cook Time", validators=[DataRequired()])
    serving_size = IntegerField(
        "Serving Size", validators=[DataRequired(), NumberRange(min=1, max=50)]
    )
    img = FormField(ImageForm)
    instructions = TextAreaField("Instructions", validators=[DataRequired()])


class TagForm(FlaskForm):
    tag =  StringField('Tag', validators=[Optional()])
