from flask_wtf import FlaskForm
from app.api.aws_helper import ALLOWED_EXTENSIONS
from wtforms import StringField, IntegerField, SelectField, TextAreaField
from wtforms.validators import DataRequired, Length, NumberRange, Optional
from flask_wtf.file import FileField, FileAllowed

class RecipeForm(FlaskForm):
    meal_name = StringField("Meal", validators=[DataRequired(), Length(min=2, max=200)])
    course_type = SelectField(
        "Course Type",
        choices=["Breakfast", "Lunch", "Dinner", 'Dessert', "Snack", "Drink"],
        validators=[DataRequired()],
    )
    prep_time = StringField("Prep Time", validators=[DataRequired()])
    cook_time = StringField("Cook Time", validators=[DataRequired()])
    serving_size = IntegerField(
        "Serving Size", validators=[DataRequired(), NumberRange(min=1, max=50)]
    )
    img = FileField("Image File", validators=[DataRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    instructions = TextAreaField("Instructions", validators=[DataRequired()])


class TagForm(FlaskForm):
    tag =  StringField('Tag', validators=[Optional()])
