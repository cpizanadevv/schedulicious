from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Schedule, db, schedule_meals
from app.forms import ScheduleForm, ScheduleMealsForm
from sqlalchemy import select

schedule_routes = Blueprint('schedules', __name__)

@schedule_routes.route('/new-schedule', methods=['POST'])
@login_required
def create_schedule():
    form = ScheduleForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    
    if form.validate_on_submit:
        schedule = Schedule(
            user_id = current_user.id,
            start_date = form['start_date'],
            end_date = form['end_date']
        )
        
        db.session.add(schedule)
        db.session.commit()
        return schedule.to_dict()
    
@schedule_routes.route('/<int:schedule_id>/edit-schedule', methods=['PUT'])
@login_required
def edit_schedule(schedule_id):
    form = ScheduleForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    
    
    if form.validate_on_submit:
        schedule_to_edit = Schedule.query.get(schedule_id)
        
        if not schedule_to_edit:
            return jsonify({'errors':'Schedule not found'}), 404
        
        schedule_to_edit.user_id = current_user.id,
        schedule_to_edit.start_date = form['start_date'],
        schedule_to_edit.end_date = form['end_date']
        
        db.session.commit()
        return schedule_to_edit.to_dict()
    
    return form.errors, 400
    
@schedule_routes.route('/', methods=['GET'])
@login_required
def get_user_schedules():
    schedules = Schedule.query.filter(Schedule.user_id == current_user.id).all()
    return schedules
    
@schedule_routes.route('/<int:schedule_id>/delete', methods=['DELETE'])
@login_required
def delete_user_schedules(schedule_id):
    schedule = Schedule.query.get(schedule_id)
    if schedule:
        db.session.delete(schedule)
        db.session.commit()
        return jsonify({'message': 'Schedule has been deleted.'}), 200
    
    return jsonify({'message': 'Schedule has not found.'}), 404

    
@schedule_routes.route('/<int:recipe_id>/<int:schedule_id>/', methods=['POST'])
@login_required
def create_schedule_meals(recipe_id,schedule_id):
    form = ScheduleMealsForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    
    if form.validate_on_submit:
        
        schedule_meal = db.execute(select([schedule_meals]).where(schedule_meals.c.recipe_id == recipe_id, schedule_meals.schedule_id == schedule_id)).fetchone()
        
        if schedule_meal:
            return {'errors': 'Recipe is already in Schedule'}, 400
        
        day_schedule = {
            'recipe_id' : recipe_id,
            'schedule_id' : schedule_id,
            'day_of_week' : form['day_of_week']
        }
        
        db.session.execute(schedule_meals.insert().values(day_schedule))
        db.session.commit()
        return jsonify(day_schedule), 201
    
@schedule_routes.route('/<int:schedule_id>/<day_of_week>', methods=['GET'])
@login_required
def get_schedule_day(schedule_id,day_of_week):
    schedule_day = db.execute(select([schedule_meals]).where(schedule_meals.schedule_id == schedule_id,schedule_meals.c.day_of_week == day_of_week )).fetchall()
    if not schedule_day:
        return {'errors': 'Schedule day not found'}, 404
    return jsonify(schedule_day), 200

@schedule_routes.route('/<int:schedule_id>/<int:recipe_id>/delete', methods=['DELETE'])
@login_required
def delete_schedule_meals(schedule_id,recipe_id):
    to_delete = db.execute(select([schedule_meals]).where(schedule_meals.schedule_id == schedule_id,schedule_meals.c.recipe_id == recipe_id )).fetchone()
    if not to_delete:
        return {'errors': 'Schedule Meal not found'}, 404
       
    delete_stmt = (
        db.Table.delete()
        .where(schedule_meals.schedule_id == schedule_id)
        .where(schedule_meals.c.recipe_id == recipe_id )
    )
    db.session.execute(delete_stmt)
    db.session.commit()
    return jsonify(to_delete), 201