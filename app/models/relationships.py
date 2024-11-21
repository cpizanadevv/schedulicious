from .db import db, environment, SCHEMA, add_prefix_for_prod

recipe_tags = db.Table(
    "recipe_tags",
    db.Model.metadata,
    db.Column("tag_id", db.Integer, db.ForeignKey(add_prefix_for_prod("tags.id")), primary_key=True),
    db.Column("recipe_id", db.Integer, db.ForeignKey(add_prefix_for_prod("recipes.id"), ondelete='CASCADE'), primary_key=True),
)

recipe_ingredients = db.Table(
    "recipe_ingredients",
    db.Model.metadata,
    db.Column("ingredient_id", db.Integer, db.ForeignKey(add_prefix_for_prod("ingredients.id")), primary_key=True),
    db.Column("recipe_id", db.Integer, db.ForeignKey(add_prefix_for_prod("recipes.id"), ondelete='CASCADE'), primary_key=True),
    db.Column('quantity', db.String, nullable=False)
    
)

# schedule_meals = db.Table (
#     'schedule_meals',
#     db.Model.metadata,
#     db.Column('recipe_id', db.Integer, db.ForeignKey(add_prefix_for_prod("recipes.id"), ondelete='CASCADE')),
#     db.Column('date', db.Date, nullable=False),
#     db.Column('day_of_week', db.String, nullable=False),
#     db.UniqueConstraint('recipe_id', 'day_of_week', name='day-meals')
# )

favorites = db.Table (
    'favorites',
    db.Model.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey(add_prefix_for_prod("users.id"), ondelete='CASCADE'), primary_key=True),
    db.Column('recipe_id', db.Integer, db.ForeignKey(add_prefix_for_prod("recipes.id"), ondelete='CASCADE'), primary_key=True)
)

allergies = db.Table (
    'allergies',
    db.Model.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey(add_prefix_for_prod("users.id"), ondelete='CASCADE'), primary_key=True),
    db.Column('allergen_id', db.Integer, db.ForeignKey(add_prefix_for_prod("allergens.id"), ondelete='CASCADE'), primary_key=True)
)

if environment == "production":
    recipe_tags.schema = SCHEMA
    recipe_ingredients.schema = SCHEMA
    allergies.schema = SCHEMA
    favorites.schema = SCHEMA