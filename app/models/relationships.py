from .db import db, environment, SCHEMA, add_prefix_for_prod

recipe_tags = db.Table(
    "recipe_tags",
    db.Model.metadata,
    db.Column("tag_id", db.Integer, db.ForeignKey(add_prefix_for_prod("tags.id"), ondelete='CASCADE'), primary_key=True),
    db.Column("recipe_id", db.Integer, db.ForeignKey(add_prefix_for_prod("recipes.id"), ondelete='CASCADE'), primary_key=True),
)

recipe_ingredients = db.Table(
    "recipe_ingredients",
    db.Model.metadata,
    db.Column("ingredient_id", db.Integer, db.ForeignKey(add_prefix_for_prod("ingredients.id"), ondelete='CASCADE'), primary_key=True),
    db.Column("recipe_id", db.Integer, db.ForeignKey(add_prefix_for_prod("recipes.id"), ondelete='CASCADE'), primary_key=True),
    db.Column('quantity', db.String, nullable=False)
)

if environment == "production":
    __table_args__ = {"schema": SCHEMA}
    

