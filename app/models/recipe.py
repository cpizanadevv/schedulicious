from .db import db, environment, SCHEMA, add_prefix_for_prod
from .relationships import recipe_ingredients, recipe_tags
from .ingredient import Ingredient
from .tag import Tag


class Recipe(db.Model):
    __tablename__ = "recipes"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    meal_name = db.Column(db.String(200), nullable=False)
    course_type = db.Column(db.String, nullable=False)
    prep_time = db.Column(db.Integer, nullable=False)
    cook_time = db.Column(db.Integer, nullable=False)
    serving_size = db.Column(db.Integer, nullable=False)
    calories = db.Column(db.Integer, nullable=False)
    img = db.Column(db.String, nullable=False)
    instructions = db.Column(db.String, nullable=False)
    source = db.Column(db.String, nullable=True)

    user = db.relationship("User", back_populates="recipes")
    ingredients = db.relationship(
        "Ingredient",
        secondary=recipe_ingredients,
        lazy="joined",
        backref=db.backref("recipes", lazy="joined"),
    )
    tags = db.relationship(
        "Tag",
        secondary=recipe_tags,
        lazy="subquery",
        backref=db.backref("recipes", lazy="selectin"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "meal_name": self.meal_name,
            "prep_time": self.prep_time,
            "cook_time": self.cook_time,
            "serving_size": self.serving_size,
            "calories": self.calories,
            "img": self.img,
            "ingredients": self.ingredients,
            "instructions": self.instructions,
            "tags": self.tags,
            "source": self.source,
        }
