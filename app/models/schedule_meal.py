from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.schema import UniqueConstraint
from sqlalchemy.orm import validates

class ScheduleMeal(db.Model):
    __tablename__ = 'schedule_meals'
    
    if environment == "production":
        __table_args__ =  {'schema': SCHEMA}
    
    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("recipes.id"), ondelete='CASCADE'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    day_of_week = db.Column(db.String, nullable=False)
    
    recipes = db.relationship("Recipe", back_populates="schedule_meals")
    
    @validates(date)
    def validate_date(self,key,date):
        if date.getDay() != self.day_of_week:
            raise ValueError('Day of the week and Date do not match.')
        return date
    
    def to_dict(self):
        return {
            "id": self.id,
            "recipe_id": self.recipe_id,
            "date": self.date.strftime("%Y-%m-%d"),
            "day_of_week": self.day_of_week
        }