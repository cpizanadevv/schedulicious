from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Recipe, Ingredient, db, recipe_ingredients
from app.forms import IngredientForm,RecipeIngredientForm
import os
import requests
from sqlalchemy import select


ingredient_routes = Blueprint("ingredients", __name__)


@ingredient_routes.route("/add-ingredient", methods=["POST"])
@login_required
def add_ingredient():
    form = IngredientForm()
    
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        ingredient_exists = Ingredient.query.filter(
            Ingredient.name == form.data["name"]
        ).one_or_none()
        if ingredient_exists:
            return jsonify(ingredient_exists.to_dict()), 200

        ingredient = Ingredient(
            name=form.data['name'],
            calories=form.data['calories'],
            protein=form.data['protein'],
            fat=form.data['fat'],
            carbs=form.data['carbs'],
        )
        print(ingredient)
        db.session.add(ingredient)
        db.session.commit()
        return jsonify(ingredient.to_dict()), 201
    return {'errors': form.errors}, 400


@ingredient_routes.route("/add-recipe-ingredient/<int:recipe_id>/<int:ingredient_id>", methods=["POST"])
@login_required
def add_recipe_ingredient(recipe_id, ingredient_id):
    form = RecipeIngredientForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    # Check if the ingredient exists
    
    recipe = Recipe.query.get(recipe_id)
    if not recipe:
        return {'errors': 'Recipe not found.'}, 404
    ingredient = Ingredient.query.get(ingredient_id)
    
    if not ingredient:
        return {'errors': {'ingredient': ['Ingredient not found.']}}, 404
 
    # Check if the recipe-ingredient relationship already exists
    res = select([recipe_ingredients]).where(
    recipe_ingredients.c.recipe_id == recipe_id,
    recipe_ingredients.c.ingredient_id == ingredient_id
    )
    
    recipe_ingredient_exists = db.session.execute(res).fetchone()

    if recipe_ingredient_exists:
        return jsonify({"error": "Recipe-ingredient relationship already exists"}), 400

    if form.validate_on_submit():
        new_recipe_ingredient = {
            'recipe_id':recipe_id,
            'ingredient_id':ingredient_id,
            'quantity':form.data['quantity']
        }
        
        insert = recipe_ingredients.insert().values(new_recipe_ingredient)
        db.session.execute(insert)
        db.session.commit()
        return jsonify(new_recipe_ingredient), 201

    return {'errors': form.errors}, 400


@ingredient_routes.route(
    "/<int:recipe_id>/<int:ingredient_id>/delete-recipe-ingredient", methods=["DELETE"]
)
@login_required
def delete_ingredient(recipe_id, ingredient_id):
    recipe_ingredient_to_delete = recipe_ingredients.query.filter(
        recipe_ingredients.recipe_id == recipe_id,
        recipe_ingredients.ingredient_id == ingredient_id,
    ).one_or_none()

    ingredient_deleted = False

    if not recipe_ingredient_to_delete:
        return jsonify({"error": "recipe-ingredient relationship not found"}), 404

    # Checking if tag is being used elsewhere
    ingredient_usage = recipe_ingredients.query.filter(
        recipe_ingredients.ingredient_id == ingredient_id
    ).count()
    if ingredient_usage == 1:
        curr_ingredient = Ingredient.query.filter(
            Ingredient.id == ingredient_id
        ).one_or_none()
        if curr_ingredient:
            db.session.delete(curr_ingredient)
            ingredient_deleted = True
        else:
            return jsonify({"errors": "Tag not found"}), 404

    db.session.delete(recipe_ingredient_to_delete)
    db.session.commit()
    
    return jsonify({"error": "Recipe-Ingredient relationship deleted successfully"}), 204

#* API call for nutritional values - will be used for macro calculation

@ingredient_routes.route("/fetch-nutritional-data/<ingredient_name>", methods=["POST"])
@login_required
def nutritional_data(ingredient_name):
    
    api_key = os.getenv('API_KEY')
    url = f"https://api.nal.usda.gov/fdc/v1/food/search?"
    
    response = requests.get(f'{url}?query={ingredient_name}apikey={api_key}')
    data = response.json()
    
    if 'results' in data and len(data['results']) > 0:
        ingredient = data['results'][0]
        nutrition = ingredient.get('nutrition', {})
        return jsonify({
            'calories': nutrition.get('calories', 0),
            'protein': nutrition.get('protein', 0),
            'fat': nutrition.get('fat', 0),
            'carbs': nutrition.get('carbs', 0)
        }), 200
    else:
        return jsonify({'errors': 'Ingredient not found'}), 404
    
    