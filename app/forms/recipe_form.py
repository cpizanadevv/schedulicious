from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, TimeField, SelectField, TextAreaField, FieldList, FormField
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
    img = StringField("Image", validators=[DataRequired(), URL(message="Invalid URL.")])
    instructions = TextAreaField("Instructions", validators=[DataRequired()])
    ingredients = FieldList(FormField('IngredientForm'), min_entries=1)


class IngredientForm(FlaskForm):
    quantity = StringField("Quantity", validators=[DataRequired()])
    name = StringField("Ingredient Name", validators=[DataRequired()])
    calories = IntegerField("Calories", validators=[ NumberRange(min=1),Optional()])
    protein = IntegerField("Protein", validators=[ NumberRange(min=1),Optional()])
    fat = IntegerField("Fat", validators=[ NumberRange(min=1),Optional()])
    carbs = IntegerField("Carbs", validators=[ NumberRange(min=1),Optional()])

class TagForm(FlaskForm):
    tag =  StringField('Tag', validators=[Optional()])
