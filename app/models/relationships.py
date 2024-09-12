from .db import db, environment, SCHEMA, add_prefix_for_prod
from .tag import Tag
from .ingredient import Ingredient
from .recipe import Recipe
from .schedule import Schedule

recipe_tags = db.Table(
    "recipe_tags",
    db.Column("tag_id", db.Integer, db.ForeignKey(add_prefix_for_prod("tags.id")), primary_key=True),
    db.Column("recipe_id", db.Integer, db.ForeignKey(add_prefix_for_prod("recipes.id")), primary_key=True),
)

recipe_ingredients = db.Table(
    "recipe_ingredients",
    db.Column("ingredient_id", db.Integer, db.ForeignKey(add_prefix_for_prod("ingredients.id")), primary_key=True),
    db.Column("recipe_id", db.Integer, db.ForeignKey(add_prefix_for_prod("recipes.id")), primary_key=True),
    db.Column('quantity', db.String, nullable=False),
    db.Column('unit', db.String, nullable=True)
)

schedule_meals = db.Table (
    'schedule_meals',
    db.column('recipe_id', db.Integer, db.ForeignKey(add_prefix_for_prod("recipes.id")), primary_key=True),
    db.column('schedule_id', db.Integer, db.ForeignKey(add_prefix_for_prod('schedules.id'), primary_key=True)),
    db.column('day_of_week', db.String, nullable=False)
)

if environment == "production":
    __table_args__ = {"schema": SCHEMA}
    

