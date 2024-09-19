from app.models import db, recipe_ingredients, environment, SCHEMA
from sqlalchemy.sql import text

def seed_ingredients():
    recipeIngredients = [
      {
        'recipe_id': 1,  #  Chili Garlic Shrimp over Risotto
        'ingredient_id': 1,  # Garlic
        'quantity': '3 cloves',
      },
      {
        'recipe_id': 1,  # Chili Garlic Shrimp over Risotto
        'ingredient_id': 2,  # Lemon
        'quantity': '1 large',
      },
      {
        'recipe_id': 1,  # Chili Garlic Shrimp over Risotto
        'ingredient_id': 4,  # Shrimp
        'quantity': '1 pound',
      },
      {
        'recipe_id': 1,  # Chili Garlic Shrimp over Risotto
        'ingredient_id': 6,  # Chicken Stock
        'quantity': '4 cups',
      },
      {
        'recipe_id': 1,  # Chili Garlic Shrimp over Risotto
        'ingredient_id': 7,  # Arborio Rice
        'quantity': '1 cup',
      },
      {
        'recipe_id': 2,  # Garlicky White Sauce Flatbread
        'ingredient_id': 1,  # Garlic
        'quantity': '4 cloves',
      },
      {
        'recipe_id': 2,  # Garlicky White Sauce Flatbread
        'ingredient_id': 13,  # Flatbread
        'quantity': '1 large piece',
      },
      {
        'recipe_id': 2,  # Garlicky White Sauce Flatbread
        'ingredient_id': 14,  # Cream Cheese
        'quantity': '2 oz',
      },
      {
        'recipe_id': 2,  # Garlicky White Sauce Flatbread
        'ingredient_id': 15,  # Shredded Mozzarella
        'quantity': 'Measure with you heart',
      },
      {
        'recipe_id': 3,  # Italian Pork Sausage Gnocchi Bake
        'ingredient_id': 16,  # Pork Sausage
        'quantity': '',
      },
      {
        'recipe_id': 3,  # Italian Pork Sausage Gnocchi Bake
        'ingredient_id': 18,  # Olive Oil
        'quantity': '',
      },
      {
        'recipe_id': 3,  # Italian Pork Sausage Gnocchi Bake
        'ingredient_id': 9,  # Roma Tomato
        'quantity': '',
      },
      {
        'recipe_id': 4,  # Chicken Sausage Tomato Soup with Couscous
        'ingredient_id': 23,  # Chicken Sausage
        'quantity': '',
      },
      {
        'recipe_id': 4,  # Chicken Sausage Tomato Soup with Couscous
        'ingredient_id': 8,  # Shredded Parmesan
        'quantity': '',
      },
      {
        'recipe_id': 4,  # Chicken Sausage Tomato Soup with Couscous
        'ingredient_id': 6,  # Chicken Stock
        'quantity': '',
      },
      {
        'recipe_id': 7,
        'ingredient_id': 59,
        'quantity': '',  # Egg
    },
    {
        'recipe_id': 7,
        'ingredient_id': 68,
        'quantity': '',  # Dried Guajillo Chiles
    },
    {
        'recipe_id': 7,
        'ingredient_id': 14,
        'quantity': '',  # White Onion
    },
    {
        'recipe_id': 7,
        'ingredient_id': 69,
        'quantity': '',  # Cumin Seeds
    },
    {
        'recipe_id': 7,
        'ingredient_id': 70,
        'quantity': '',  # Mexican Oregano
    },
    {
        'recipe_id': 7,
        'ingredient_id': 71,
        'quantity': '',  # Cilantro
    },
    {
        'recipe_id': 7,
        'ingredient_id': 72,
        'quantity': '',  # Cotija Cheese
    },
    {
        'recipe_id': 7,
        'ingredient_id': 73,
        'quantity': '',  # Radish
    },
    {
        'recipe_id': 8,
        'ingredient_id': 20,
        'quantity': '',  # Masa Harina
    },
    {
        'recipe_id': 8,
        'ingredient_id': 21,
        'quantity': '',  # Water
    },
    {
        'recipe_id': 8,
        'ingredient_id': 22,
        'quantity': '',  # Lard
    },
    {
        'recipe_id': 8,
        'ingredient_id': 74,
        'quantity': '',  # Refried Beans
    },
    {
        'recipe_id': 8,
        'ingredient_id': 75,
        'quantity': '',  # Lettuce
    },
    {
        'recipe_id': 8,
        'ingredient_id': 76,
        'quantity': '',  # Beef
    },
    {
        'recipe_id': 8,
        'ingredient_id': 77,
        'quantity': '',  # Chicken
    },
    {
        'recipe_id': 8,
        'ingredient_id': 78,
        'quantity': '',  # Queso Fresco
    },
    {
        'recipe_id': 8,
        'ingredient_id': 79,
        'quantity': '',  # Mexican Cream
    },
    {
        'recipe_id': 9,
        'ingredient_id': 80,
        'quantity': '',  # All Purpose Flour
    },
    {
        'recipe_id': 9,
        'ingredient_id': 81,
        'quantity': '',  # Sugar
    },
    {
        'recipe_id': 9,
        'ingredient_id': 82,
        'quantity': '',  # Baking Powder
    },
    {
        'recipe_id': 9,
        'ingredient_id': 83,
        'quantity': '',  # Vanilla Extract
    },
    {
        'recipe_id': 9,
        'ingredient_id': 84,
        'quantity': '',  # Cinnamon
    },
    {
        'recipe_id': 9,
        'ingredient_id': 59,
        'quantity': '',  # Egg
    },
    {
        'recipe_id': 10,
        'ingredient_id': 85,
        'quantity': '',  # White rice
    },
    {
        'recipe_id': 10,
        'ingredient_id': 86,
        'quantity': '',  # Cinnamon Sticks
    },
    {
        'recipe_id': 10,
        'ingredient_id': 87,
        'quantity': '',  # Evaporated Milk
    },
    {
        'recipe_id': 10,
        'ingredient_id': 88,
        'quantity': '',  # Sweetened Condensed Milk
    },
]
    for recipe_ingredient in recipe_ingredients:
        stmt = recipe_ingredients.insert().values(
            recipe_id=recipe_ingredient['recipe_id'],
            ingredient_id=recipe_ingredient['ingredient_id'],
            quantity=recipe_ingredient['quantity']
        )
        db.session.execute(stmt)

    db.session.commit()
def undo_recipe_ingredients():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.recipe_ingredients RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM recipe_ingredients"))

    db.session.commit()