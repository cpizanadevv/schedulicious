from .db import db, environment, SCHEMA, add_prefix_for_prod
from .tag import Tag
from .recipe import Recipe

recipe_tags = db.Table(
    "recipe_tags",
    db.Column("tag_id", db.Integer, db.ForeignKey("tags.id"), primary_key=True),
    db.Column("recipe_id", db.Integer, db.ForeignKey("recipes.id"), primary_key=True),
)

recipe_ingredients = db.Table(
    "recipe_ingredients",
    db.Column("ingredient_id", db.Integer, db.ForeignKey("ingredients.id"), primary_key=True),
    db.Column("recipe_id", db.Integer, db.ForeignKey("recipes.id"), primary_key=True),
)






if environment == "production":
    __table_args__ = {"schema": SCHEMA}
    

