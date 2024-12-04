from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import ScheduleMeal, db, Recipe
from app.forms import ScheduleForm, ScheduleMealsForm
from sqlalchemy import select, and_
from datetime import datetime
from sqlalchemy import extract
from sqlalchemy.orm import joinedload


schedule_routes = Blueprint("schedules", __name__)


@schedule_routes.route("/<int:recipe_id>/<date>/add", methods=["POST"])
@login_required
def add_schedule_meals(recipe_id, date):
    form = ScheduleMealsForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    date_obj = datetime.strptime(date, "%Y-%m-%d").date()

    if form.validate_on_submit():
        recipe = Recipe.query.get(recipe_id)

        if not recipe:
            return {"errors": "Recipe not found"}, 404

        schedule_meal = ScheduleMeal.query.filter(
            ScheduleMeal.date == date_obj, ScheduleMeal.recipe_id == recipe_id
        ).first()

        if schedule_meal:
            return schedule_meal.to_dict(), 200

        to_add = ScheduleMeal(
            recipe_id=recipe_id, date=date_obj, day_of_week=form.data["day_of_week"]
        )

        db.session.add(to_add)
        db.session.commit()
        return to_add.to_dict(), 201
    return jsonify({"errors": form.errors}), 400


@schedule_routes.route("/<date>/<day_of_week>/meals", methods=["GET"])
@login_required
def get_day_meals(date, day_of_week):
    day_meals = ScheduleMeal.query.filter(
        ScheduleMeal.date == date, ScheduleMeal.day_of_week == day_of_week
    ).all()

    if not day_meals:
        return jsonify({}), 200

    day_meals_data = {}
    for row in day_meals:
        recipe = Recipe.query.get(row.recipe_id)
        if recipe:
            day_meals_data[row.recipe_id] = {
                "recipe_id": row.recipe_id,
                "meal_name": recipe.meal_name,
                "img": recipe.img,
            }

    return jsonify(day_meals_data), 200


@schedule_routes.route("/<start>/<end>/meals", methods=["GET"])
@login_required
def get_all_meals(start, end):

    start_date = datetime.strptime(start, "%Y-%m-%d").date()
    end_date = datetime.strptime(end, "%Y-%m-%d").date()

    meals = ScheduleMeal.query.options(joinedload(ScheduleMeal.recipes)).filter(ScheduleMeal.date.between(start_date, end_date)).all()

    if not meals:
        return jsonify({}), 200

    meals_data = [
    {
        "recipe_id": meal.recipe_id,
        "meal_name": meal.recipes.meal_name,
        "date": meal.date.strftime("%Y-%m-%d"),
    }
    for meal in meals if meal.recipe
]

    return jsonify(meals_data), 200


@schedule_routes.route("/<date>/<int:recipe_id>/delete", methods=["DELETE"])
@login_required
def delete_meal(date, recipe_id):
    meal = ScheduleMeal.query.filter(
        ScheduleMeal.date == date, ScheduleMeal.recipe_id == recipe_id
    ).first()

    if not meal:
        return {"errors": "Meal not found"}, 404

    db.session.delete(meal)
    db.session.commit()
    return meal.to_dict(), 200
