from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Recipe, Ingredient, db, recipe_ingredients
from app.forms import IngredientForm,RecipeIngredientForm
import os
import requests
from sqlalchemy import select


ingredient_routes = Blueprint("ingredients", __name__)

api_key = os.getenv('API_KEY')

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
    
    recipe_ingredient_exists = db.session.execute(
        select([recipe_ingredients]).where(
            recipe_ingredients.c.recipe_id == recipe_id,
                recipe_ingredients.c.ingredient_id == ingredient_id
    )).fetchone()

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

@ingredient_routes.route("/search_ingredient/<ingredient_name>", methods=["POST"])
@login_required
def search_ingredient(ingredient_name):
    
    if ingredient_name.includes(' '):
        ingredient_name.replace(" ",'%20')
        
    
    response = requests.get(f'https://api.nal.usda.gov/fdc/v1/foods/search?api_key={api_key}&query={ingredient_name}')
    
    data = response.json()
    
    if response.status_code == 200:
        data = response.json()
        food_id = data.foods.fdcId
        return jsonify(food_items), 200
    else:
        return jsonify({'errors': 'Ingredient not found'}), 404
    
    

@ingredient_routes.route("/get_nutrient_info/<int:id>", methods=["POST"])
@login_required
def get_nutrient_info(id):
    
    url = f"https://api.nal.usda.gov/fdc/v1/food/{id}?api_key={api_key}"
    
    response = requests.get(url)
    data = response.json()
    
    if response.status_code == 200:
        data = response.json()
        nutrients = {nutrient['nutrientName']: nutrient['value'] for nutrient in data.get('foodNutrients', [])}
        
        nutrient_info = {
            'calories': nutrients.get('Energy'),
            'protein': nutrients.get('Protein'),
            'fat': nutrients.get('Total lipid (fat)'),
            'carbs': nutrients.get('Carbohydrate, by difference')
        }
        return jsonify(nutrient_info), 200
    else:
        return jsonify({'errors': 'Ingredient not found'}), 404