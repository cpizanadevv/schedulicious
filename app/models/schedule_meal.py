from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.schema import UniqueConstraint
from sqlalchemy.orm import validates

class ScheduleMeal(db.Model):
    __tablename__ = 'schedule_meals'
    
    if environment == "production":
        __table_args__ = ({"schema": SCHEMA}, UniqueConstraint('recipe_id', 'day_of_week', name='day-meals'))
    else:
        __table_args__ = (UniqueConstraint('recipe_id', 'day_of_week', name='day-meals'),)
    
    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("recipes.id"), ondelete='CASCADE'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    day_of_week = db.Column(db.String, nullable=False)
    
    recipe = db.relationship("Recipe", back_populates="schedule_meals")
    
    @validates(date)
    def validate_date(self,key,date):
        if date.get(day) != self.day_of_week:
            raise ValueError('Day of the week and Date do not match.')
        return date
    
    def to_dict(self):
        return {
            "id": self.id,
            "recipe_id": self.recipe_id,
            "date": self.date.strftime("%m-%d-%Y"),
            "day_of_week": self.day_of_week
        }
