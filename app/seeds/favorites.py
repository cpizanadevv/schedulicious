from app.models import db, relationships, environment, SCHEMA, User, Recipe
from app.models.relationships import favorites
from sqlalchemy.sql import text
import random

def seed_fav():
    user_count = 3 
    num_favorites_per_user = 5
    for user in range(1, user_count + 1):
        added_recipes = set()
        while len(added_recipes) < num_favorites_per_user:
            recipe_id = random.randint(1, 10)
            if recipe_id not in added_recipes:
                added_recipes.add(recipe_id)
                db.session.execute(
                    favorites.insert().values(user_id=user, recipe_id=recipe_id)
                )
    db.session.commit()
    

def undo_fav():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.favorites RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM favorites"))

    db.session.commit()
