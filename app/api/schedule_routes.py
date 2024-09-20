from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Schedule, db
from app.forms import ScheduleForm, ScheduleMealsForm

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
    
@schedule_routes.route('/<int:schedule_id>', methods=['GET'])
@login_required
def get_user_schedules():
    schedules = Schedule.query.filter(Schedule.user_id == current_user.id).all()
    return schedules

    
@schedule_routes.route('/<int:recipe_id>/<int:schedule_id>/', methods=['POST'])
@login_required
def create_schedule_meals(recipe_id,schedule_id):
    form = ScheduleMealsForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    
    if form.validate_on_submit:
        day_schedule = Schedule(
            recipe_id = recipe_id,
            schedule_id = schedule_id,
            day_of_week = form['day_of_week']
        )
        
        db.session.add(day_schedule)
        db.session.commit()
        return day_schedule.to_dict()
    
@schedule_routes.route('/<int:schedule_id>', methods=['GET'])
@login_required
def get_schedule_day():
    schedules = Schedule.query.filter(Schedule.user_id == current_user.id).all()
    return schedules
