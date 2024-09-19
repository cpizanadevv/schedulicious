from flask.cli import AppGroup
from .users import seed_users, undo_users
from .recipes import seed_recipes, undo_recipes
from .ingredients import seed_ingredients, undo_ingredients
from .recipe_ingredients import seed_recipe_ingredients, undo_recipe_ingredients
from .recipe_tags import seed_recipe_tags, undo_recipe_tags
from .tags import seed_tags, undo_tags

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_recipe_tags()
        undo_recipe_ingredients()
        undo_tags()
        undo_ingredients()
        undo_recipes()
        undo_users()
    seed_users()
    seed_recipes()
    seed_ingredients()
    seed_tags()
    seed_recipe_ingredients()
    seed_recipe_tags()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_recipes()
    undo_ingredients()
    undo_tags()
    undo_recipe_ingredients()
    undo_recipe_tags()
    # Add other undo functions here
