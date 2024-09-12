from .db import db, environment, SCHEMA, add_prefix_for_prod
from .relationships import recipe_ingredients, recipe_tags, schedule_meals
from .ingredient import Ingredient
from .tag import Tag


class Schedule(db.Model):
    __tablename__ = 'schedules'
    
    if environment == "production":
        __table_args__ = {"schema": SCHEMA}
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    start_date = db.Column(db.Date, nullable=False)
    
    user = db.relationship("User", back_populates="schedules")
    recipes = db.relationship('Recipe', secondary=schedule_meals,lazy="joined",back_populates="schedules", lazy="joined")
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'start_date': self.start_date,
            'schedule_meals': {meals.day_of_week :meals.to_dict() for meals in self.schedule_meals}
        }