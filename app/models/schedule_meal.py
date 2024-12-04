from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.schema import UniqueConstraint
from sqlalchemy.orm import validates


class ScheduleMeal(db.Model):
    __tablename__ = "schedule_meals"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("recipes.id"), ondelete="CASCADE"),
        nullable=False,
    )
    date = db.Column(db.Date, nullable=False)

    recipes = db.relationship("Recipe", back_populates="schedule_meals")
    db.UniqueConstraint("recipe_id", "date", name="day-meals")
    
    def to_dict(self):
        return {
            "id": self.id,
            "recipe_id": self.recipe_id,
            "date": self.date.strftime("%Y-%m-%d")
        }
