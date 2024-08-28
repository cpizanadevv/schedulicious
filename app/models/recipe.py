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
        backref=db.backref("recipes", lazy="selecting"),
    )

    def macros(self):
        total_calories = 0
        total_protein = 0
        total_fat = 0
        total_carbs = 0
        for recipe_ingredient in self.recipe_ingredients:
            ingredient = recipe_ingredient.ingredient
            quantity = recipe_ingredient.quantity
            unit = recipe_ingredient.unit

            if unit == "g":
                factor = quantity / 100.0
            elif unit == "kg":
                factor = (quantity * 1000) / 100.0
            elif unit == "ml":
                factor = quantity / 100.0
            elif unit == "l":
                factor = (quantity * 1000) / 100.0
            elif unit == "oz":
                factor = (quantity * 28.35) / 100.0

            total_calories += ingredient.calories * factor
            total_protein += ingredient.protein * factor
            total_fat += ingredient.fat * factor
            total_carbs += ingredient.carbs * factor
        return {
            "total_calories": total_calories,
            "total_protein": total_protein,
            "total_fat": total_fat,
            "total_carbohydrates": total_carbs,
        }

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
            "instructions": self.instructions,
            "source": self.source,
            "ingredients": [ingredient.to_dict() for ingredient in self.ingredients],
            "tags": [tag.to_dict() for tag in self.tags],
        }
