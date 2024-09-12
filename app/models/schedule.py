from .db import db, environment, SCHEMA, add_prefix_for_prod
from .relationships import recipe_ingredients, recipe_tags
from .ingredient import Ingredient
from .tag import Tag

class Schedule(db.Model):
    __tablename__ = 'schedule'
    
    if environment == "production":
        __table_args__ = {"schema": SCHEMA}
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    startDate = db.Column(db.Date, nullable=False)
    
    user = db.relationship("User", back_populates="schedules")
    