from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.types import TypeDecorator, String
from .relationships import recipe_ingredients, recipe_tags
from .ingredient import Ingredient
from .tag import Tag
from flask_login import current_user

class InstructionArr(TypeDecorator):
    # Sets db level val as a String
    impl = String
    delimiter = '|'
    
    def process_bind_param(self, value, dialect):
        if value is not None:
            return self.delimiter.join(value)
        return value
    
    def process_result_value(self, value,dialect):
        if value is not None:
            return value.split(self.delimiter)
    


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
    prep_time = db.Column(db.String, nullable=False)
    cook_time = db.Column(db.String, nullable=False)
    serving_size = db.Column(db.Integer, nullable=False)
    img = db.Column(db.String, nullable=False)
    instructions = db.Column(InstructionArr, nullable=False)
    source = db.Column(db.String(300), nullable=True)

    user = db.relationship("User", back_populates="recipes")
    ingredients = db.relationship(
        "Ingredient",
        secondary=recipe_ingredients,
        lazy="joined",
        backref=db.backref("recipe_ingredients", lazy="joined"),
    )
    tags = db.relationship(
        "Tag",
        secondary=recipe_tags,
        lazy="subquery",
        backref=db.backref("recipe_tags", lazy="subquery"),
    )
    comments = db.relationship('Comment', back_populates='recipe', cascade='all, delete')
    
    def scraped_recipe(data, user_id):
        new_recipe = Recipe(
            user_id = user_id,
            meal_name = data['meal_name'],
            course_type = data[''],
            prep_time = data['prep_time'],
            cook_time = data['cook_time'],
            serving_size = data['serving_size'],
            img = data['img'],
            instructions = data['instructions'],
            source = data['source'],
        )
        for ingredient_name in data['ingredients']:
            ingredient = Ingredient.query.filter(name = ingredient_name).first()
            if not ingredient:
                ingredient = Ingredient(name=ingredient_name)
            new_recipe.ingredients.append(ingredient)
            
        db.session.add(new_recipe)
        db.session.commit()

        return new_recipe

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
    
    def get_ingredient_quantity(self, ingredient_id):
        recipe_ingredient = db.session.execute(
            recipe_ingredients.select().where(
                recipe_ingredients.c.recipe_id == self.id,
                recipe_ingredients.c.ingredient_id == ingredient_id
            )
        ).first()
        return recipe_ingredient.quantity if recipe_ingredient else None

    def to_dict(self):
        favorited = False
        if current_user and hasattr(current_user, 'favorited_recipes'):
            favorited = self in current_user.favorited_recipes
        return {
            "id": self.id,
            "user_id": self.user_id,
            "meal_name": self.meal_name,
            "course_type": self.course_type,
            "prep_time": self.prep_time,
            "cook_time": self.cook_time,
            "serving_size": self.serving_size,
            "img": self.img,
            "instructions": self.instructions,
            "source": self.source,
            "ingredients": [
                {
                    "ingredient_id": ingredient.id,
                    "ingredient_name": ingredient.name,
                    "quantity": self.get_ingredient_quantity(ingredient.id)
                }
                for ingredient in self.ingredients
            ],
            "tags": [tag.to_dict() for tag in self.tags],
            'favorited': favorited
        }
    def to_dict_all(self):
        favorited = False
        if current_user and hasattr(current_user, 'favorited_recipes'):
            favorited = self in current_user.favorited_recipes
        return {
            "id": self.id,
            "meal_name": self.meal_name,
            "course_type": self.course_type,
            "prep_time": self.prep_time,
            "cook_time": self.cook_time,
            "serving_size": self.serving_size,
            "img": self.img,
            "ingredients": [
                {
                    "ingredient_name": ingredient.name,
                }
                for ingredient in self.ingredients
            ],
            'favorited': favorited
        }

