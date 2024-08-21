from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Recipe
from app.forms import RecipeForm

recipe_routes = Blueprint('recipes',__name__)

@recipe_routes
@login_required()
def create_recipe():
    form = RecipeForm()
    