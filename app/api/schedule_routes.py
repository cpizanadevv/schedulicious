from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import ScheduleMeal, db, Recipe
from app.forms import ScheduleForm, ScheduleMealsForm
from sqlalchemy import select, and_

schedule_routes = Blueprint("schedules", __name__)

@schedule_routes.route("/<int:recipe_id>/<date>/add", methods=["POST"])
@login_required
def add_schedule_meals(recipe_id, date):
    form = ScheduleMealsForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        recipe = Recipe.query.get(recipe_id)
        
        if not recipe:
            return {"errors": "Recipe not found"}, 404
        
        schedule_meal = ScheduleMeal.query(ScheduleMeal.date == date,ScheduleMeal.recipe_id == recipe_id).first()

        if schedule_meal:
            return schedule_meal.to_dict, 200
        
        to_add = ScheduleMeal(
            recipe_id=recipe_id,
            date = date,
            day_of_week = form.data['day_of_week']
        )
        
        db.session.add(to_add)
        db.session.commit()
        return to_add.to_dict(), 201
    return jsonify({"errors": form.errors}), 400


@schedule_routes.route("/<date>/<day_of_week>/meals", methods=["GET"])
@login_required
def get_day_meals(date, day_of_week):
    day_meals = ScheduleMeal.query.filter(
        ScheduleMeal.date == date,
        ScheduleMeal.day_of_week == day_of_week
    ).all()

    if not day_meals:
        return [],200

    day_meals_data = {}
    for row in day_meals:
        recipe_id = row["recipe_id"]
        recipe = Recipe.query.get(recipe_id)
        if recipe:
            day_meals_data[recipe_id] = {
                "recipe_id": recipe_id,
                "meal_name": recipe.meal_name,
                "img": recipe.img,
            }

    return jsonify(day_meals_data), 200

@schedule_routes.route("/<date>/<int:recipe_id>/delete", methods=["DELETE"])
@login_required
def delete_meal(date, recipe_id):
    meal = ScheduleMeal.query.filter(
        ScheduleMeal.date == date,
        ScheduleMeal.recipe_id == recipe_id
    ).first()
    
    if not meal:
        return {"errors": "Meal not found"}, 404
    
    db.session.delete(meal)
    db.session.commit()
    return meal.to_dict, 200
