from flask import Blueprint, request
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
            start_date = form['start_date']
        )
        
        db.session.add(schedule)
        db.session.commit()
        return schedule.to_dict()
    
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
    