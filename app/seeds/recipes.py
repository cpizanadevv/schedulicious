from app.models import db, Recipe, environment, SCHEMA
from sqlalchemy.sql import text


def seed_recipes():
    demo = Recipe(
        user_id= 1 ,
        meal_name= 'Demo name',
        course_type='Breakfast',
        prep_time= 10,
        cook_time= 30 ,
        serving_size= 4 ,
        calories= 400 ,
        img= 'someimg.png',
        instructions='Testing this',
        source= None
    )

    db.session.add(demo)
    db.session.commit()


def undo_recipes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.recipes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM recipes"))
        
    db.session.commit()
