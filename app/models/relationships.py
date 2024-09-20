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

schedule_meals = db.Table (
    'schedule_meals',
    db.column('recipe_id', db.Integer, db.ForeignKey(add_prefix_for_prod("recipes.id")), primary_key=True),
    db.column('schedule_id', db.Integer, db.ForeignKey(add_prefix_for_prod('schedules.id'), primary_key=True)),
    db.column('day_of_week', db.String, nullable=False)
)

if environment == "production":
    recipe_tags.schema = SCHEMA
    recipe_ingredients.schema = SCHEMA