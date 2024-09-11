from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Recipe, Ingredient, db, recipe_ingredients
from app.forms import IngredientForm
import os


ingredient_routes = Blueprint("ingredients", __name__)


@ingredient_routes.route("/add-ingredient", methods=["POST"])
@login_required
def add_ingredient():
    form = IngredientForm
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        ingredient_exists = Ingredient.query.filter(
            Ingredient.name == form.data["name"]
        ).one_or_none()
        if ingredient_exists:
            return ingredient_exists.to_dict()

        ingredient = Ingredient(
            name=form.data["name"],
            calories=form.data["calories"],
            protein=form.data["protein"],
            fat=form.data["fat"],
            carbs=form.data["carbs"],
        )

        db.session.add(ingredient)
        db.session.commit()
        return jsonify(ingredient.to_dict()), 201


@ingredient_routes.route(
    "/<int:recipe_id>/<int:ingredient_id>/add-recipe-ingredient", methods=["POST"]
)
@login_required
def add_recipe_ingredient(recipe_id, ingredient_id):

    recipe_ingredient_exists = recipe_ingredients.query.filter(
        recipe_ingredients.recipe_id == recipe_id, recipe_ingredients.ingredient_id
    ).one_or_none()

    if recipe_ingredient_exists:
        return (
            jsonify({"message": "recipe-ingredient relationship already exists"}),
            400,
        )

    new_recipe_ingredient = recipe_ingredients(
        recipe_id=recipe_id,
        ingredient_id=ingredient_id,
    )
    db.session.add(new_recipe_ingredient)
    db.session.commit()
    return jsonify(new_recipe_ingredient.to_dict()), 201


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
            return jsonify({"error": "Tag not found"}), 404

    db.session.delete(recipe_ingredient_to_delete)
    db.session.commit()
    
    return jsonify({"message": "Recipe-Ingredient relationship deleted successfully"}), 204

#* API call for nutritional values - will be used for macro calculation

@ingredient_routes.route("/fetch-nutritional-data", methods=["POST"])
@login_required
def nutritional_data():
    ingredient_name = request.json.get('name')
    
    api_key = os.getenv('API_KEY')
    url = f"https://api.nal.usda.gov/fdc/v1/foods/search?query={ingredient_name}&api_key={api_key}"
    
    response = request.get(url)
    data = response.json()
    
    if 'foods' not in data or not data['foods']:
            return jsonify({"error": "No nutritional data found"}), 404

    nutrition_info = data['foods'][0]
    calories = next((n['value'] for n in nutrition_info['foodNutrients'] if n['nutrientName'] == 'Energy'), 0)
    protein = next((n['value'] for n in nutrition_info['foodNutrients'] if n['nutrientName'] == 'Protein'), 0)
    fat = next((n['value'] for n in nutrition_info['foodNutrients'] if n['nutrientName'] == 'Total lipid (fat)'), 0)
    carbs = next((n['value'] for n in nutrition_info['foodNutrients'] if n['nutrientName'] == 'Carbohydrate, by difference'), 0)
    
    return jsonify({
            "name": ingredient_name,
            "calories": calories,
            "protein": protein,
            "fat": fat,
            "carbs": carbs
        }), 200

    
    