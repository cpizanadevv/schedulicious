from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, NumberRange, Optional

class IngredientForm(FlaskForm):
    name = StringField("Ingredient Name", validators=[DataRequired()])
    calories = IntegerField("Calories", validators=[ NumberRange(min=1),Optional()])
    protein = IntegerField("Protein", validators=[ NumberRange(min=1),Optional()])
    fat = IntegerField("Fat", validators=[ NumberRange(min=1),Optional()])
    carbs = IntegerField("Carbs", validators=[ NumberRange(min=1),Optional()])
    
class RecipeIngredientForm(FlaskForm):
    quantity = StringField("Quantity", validators=[DataRequired()])