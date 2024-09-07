from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, TimeField, SelectField, TextAreaField, FieldList
from wtforms.validators import DataRequired, Length, NumberRange, URL, Optional


class RecipeForm(FlaskForm):
    meal_name = StringField("Meal", validators=[DataRequired(), Length(min=2, max=200)])
    course_type = SelectField(
        "Course Type",
        choices=["Breakfast", "Lunch", "Dinner", "Snack", "Drink"],
        validators=[DataRequired()],
    )
    prep_time = TimeField("Prep Time", validators=[DataRequired()])
    cook_time = TimeField("Cook Time", validators=[DataRequired()])
    serving_size = IntegerField(
        "Serving Size", validators=[DataRequired(), NumberRange(min=1, max=50)]
    )
    calories = IntegerField("Calories", validators=[DataRequired(), NumberRange(min=1)])
    img = StringField("Image", validators=[DataRequired(), URL(message="Invalid URL.")])
    ingredients = FieldList(StringField('Ingredient'), min_entries=1, validators=[Optional()])
    instructions = TextAreaField("Instructions", validators=[DataRequired()])
    tags = FieldList(StringField('Tag'), min_entries=1, validators=[Optional()])


class IngredientForm(FlaskForm):
    quantity = StringField("Quantity", validators=[DataRequired()])
    name = StringField("Ingredient Name", validators=[DataRequired()])

class TagForm(FlaskForm):
    tag = FieldList(StringField('Tag'), min_entries=1, validators=[Optional()])
