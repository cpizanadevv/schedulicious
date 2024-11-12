from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Schedule, db, schedule_meals, Recipe
from app.forms import ScheduleForm, ScheduleMealsForm
from sqlalchemy import select, and_

schedule_routes = Blueprint("schedules", __name__)


@schedule_routes.route("/new-schedule", methods=["POST"])
@login_required
def create_schedule():
    form = ScheduleForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    print("END_DATE", form.data["end_date"])
    if form.validate_on_submit():
        schedule = Schedule(
            user_id=current_user.id,
            start_date=form.data["start_date"],
            end_date=form.data["end_date"],
        )

        db.session.add(schedule)
        db.session.commit()
        return schedule.to_dict()
    return form.errors


@schedule_routes.route("/<int:schedule_id>/edit-schedule", methods=["PUT"])
@login_required
def edit_schedule(schedule_id):
    form = ScheduleForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit:
        schedule_to_edit = Schedule.query.get(schedule_id)

        if not schedule_to_edit:
            return jsonify({"errors": "Schedule not found"}), 404

        schedule_to_edit.user_id = current_user.id
        schedule_to_edit.start_date = form.data["start_date"]
        schedule_to_edit.end_date = form.data["end_date"]

        db.session.commit()
        return schedule_to_edit.to_dict()

    return form.errors, 400


@schedule_routes.route("/all", methods=["GET"])
@login_required
def get_user_schedules():
    schedules = Schedule.query.filter(Schedule.user_id == current_user.id).all()
    print("SCHEDULE BACK", schedules)
    if schedules:
        schedule_list = [schedule.to_dict() for schedule in schedules]
        return jsonify(schedule_list), 200
    return [], 202


@schedule_routes.route("/<int:schedule_id>", methods=["GET"])
@login_required
def get_user_schedule(schedule_id):
    schedule = Schedule.query.filter(Schedule.id == schedule_id).first()
    if schedule:
        return schedule.to_dict(), 200
    return jsonify({"errors": "Schedule not found"}), 404


@schedule_routes.route("/<int:schedule_id>/delete", methods=["DELETE"])
@login_required
def delete_user_schedules(schedule_id):
    schedule = Schedule.query.get(schedule_id)
    if schedule:
        db.session.execute(
            schedule_meals.delete().where(schedule_meals.c.schedule_id == schedule_id)
        )
        db.session.delete(schedule)
        db.session.commit()
        return schedule.to_dict(), 200

    return jsonify({"message": "Schedule not found."}), 404


@schedule_routes.route("/<int:recipe_id>/<date>/add-meal", methods=["POST"])
@login_required
def create_schedule_meals(recipe_id, date):
    form = ScheduleMealsForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():

        schedule_meal = db.session.execute(
            select(schedule_meals)
            .where(schedule_meals.c.recipe_id == recipe_id)
            .where(schedule_meals.c.date == date)
            .where(schedule_meals.c.day_of_week == form.data["day_of_week"])
        ).fetchone()

        if schedule_meal:
            return (
                jsonify({"errors": "Recipe is already in schedule for this day."}),
                400,
            )

        recipe = Recipe.query.get(recipe_id)

        day_schedule = {
            "recipe_id": recipe_id,
            "schedule_id": schedule_id,
            "day_of_week": form.data["day_of_week"],
        }

        day_schedule_dict = {
            "recipe_id": recipe_id,
            "schedule_id": schedule_id,
            "day_of_week": form.data["day_of_week"],
            "meal": recipe.meal_name,
        }

        db.session.execute(schedule_meals.insert().values(day_schedule))
        db.session.commit()
        return jsonify(day_schedule_dict), 201
    return jsonify({"errors": form.errors}), 400


@schedule_routes.route("/<date>/<day_of_week>/meals", methods=["GET"])
@login_required
def get_day_meals(date, day_of_week):
    day_meals = db.session.execute(
        select([schedule_meals.c.recipe_id]).where(
            schedule_meals.c.date == date, schedule_meals.c.day_of_week == day_of_week
        )
    ).fetchall()

    if not day_meals:
        return []

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


@schedule_routes.route("/<int:schedule_id>/meals", methods=["GET"])
@login_required
def get_schedule_day(schedule_id):
    schedule_week = db.session.execute(
        select([schedule_meals.c.day_of_week, schedule_meals.c.recipe_id]).where(
            schedule_meals.c.schedule_id == schedule_id
        )
    ).fetchall()

    if not schedule_week:
        return []

    week_dict = {}
    for meal in schedule_week:
        day = meal[0]

        if not week_dict.get(day):
            week_dict[day] = []

        recipe_id = meal[1]

        # Get the meal name using Recipe model or logic
        recipe = Recipe.query.get(recipe_id)
        meal_name = recipe.meal_name if recipe else None

        # Assign meals to their corresponding day_of_week
        meal_obj = {"recipe_id": recipe_id, "meal_name": meal_name, "day_of_week": day}

        week_dict[day].append(meal_obj)

    return jsonify(week_dict), 200


@schedule_routes.route(
    "/<int:schedule_id>/<int:recipe_id>/<day>/delete", methods=["DELETE"]
)
@login_required
def delete_schedule_meals(schedule_id, recipe_id, day):
    to_delete = db.session.execute(
        select([schedule_meals])
        .where(schedule_meals.c.schedule_id == schedule_id)
        .where(schedule_meals.c.recipe_id == recipe_id)
        .where(schedule_meals.c.day_of_week == day)
    ).fetchone()
    if not to_delete:
        return {"errors": "Schedule Meal not found"}, 404

    delete_stmt = (
        schedule_meals.delete()
        .where(schedule_meals.c.schedule_id == schedule_id)
        .where(schedule_meals.c.recipe_id == recipe_id)
        .where(schedule_meals.c.day_of_week == day)
    )

    deleted = {"schedule_id": schedule_id, "recipe_id": recipe_id, "day_of_week": day}
    db.session.execute(delete_stmt)
    db.session.commit()
    return jsonify(deleted), 200


@schedule_routes.route("/<int:schedule_id>/<day>/delete", methods=["DELETE"])
@login_required
def delete_schedule_day(schedule_id, day):
    delete_stmt = (
        schedule_meals.delete()
        .where(schedule_meals.c.schedule_id == schedule_id)
        .where(schedule_meals.c.day_of_week == day)
    )
    delete = db.session.execute(delete_stmt)

    if delete.rowcount == 0:
        return {"errors": "Meals for day not found"}, 404

    db.session.commit()
    return jsonify({"message": "Schedule meals removed"}), 200
