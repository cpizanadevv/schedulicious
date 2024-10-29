from app.models import db, Ingredient, environment, SCHEMA
from sqlalchemy.sql import text
import os
import requests

FOOD_API = os.environ.get('API_KEY')

def fetch_nutritional_vals(query):
#     ingredient = query.replace(' ', '%20')
#     fetch_url = f"https://api.nal.usda.gov/fdc/v1/foods/search?api_key={FOOD_API}&query={ingredient}"
    
#     res = requests.get(fetch_url)
    
#     if res.status_code == 200:
#         data = res.json()
#         if data['foods']:
#             food = data['foods'][0]
#             return {
#                 'calories' : food['foodNutrients'][0]['value'],
#                 'protein': food['foodNutrients'][1]['value'],
#                 'fat': food['foodNutrients'][2]['value'],
#                 'carbs': food['foodNutrients'][3]['value'],
#                 'serving_size': food.get('servingSize', 0),
#                 'serving_size_unit': food.get('servingSizeUnit', None),
#             }
    return None
    
    
    
    

def seed_ingredients():
    ingredients = [
        {
            'name':'Garlic',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Lemon',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Scallions',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Shrimp',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Chili Flakes',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Chicken Stock',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Arborio Rice',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Shredded Parmesan',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Zucchini',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Roma Tomato',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Italian Seasoning',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Garlic Powder',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Flatbread',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Cream Cheese',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Shredded Mozzarella',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Yellow Onion',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Pork Sausage',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Tomato Paste',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Olive Oil',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Salt',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Pepper',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Butter',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Oil',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Chicken Sausage',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Corn Tortillas',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Tomatillos',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Dried Arbol Chiles',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'White Onion',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Cumin Seeds',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Mexican Oregano',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Cilantro',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Cotija Cheese',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Egg',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Dried Guajillo Chiles',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Red Onion',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Masa Harina',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Water',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Lard',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Refried Beans',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Lettuce',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Beef',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Chicken',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Queso Fresco',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Mexican Cream',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Radish',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Avocado',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Pickled Jalapenos',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'All Purpose Flour',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Sugar',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Baking Powder',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Vanilla Extract',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Cinnamon',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Whole Rolled Oats',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Chia Seeds',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Maple Syrup',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Sea Salt',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Whole Milk Greek Yogurt',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Almond Milk',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Oat Milk',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Unsweetened Applesauce',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Apple Pie spice',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Apple',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Peach',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Granola',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Jam',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Peanut Butter',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Strawberries',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Rasberries',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Peanuts',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Banana',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Cocoa Powder',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Nutmeg',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Walnuts',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Chocolate Chips',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Mini Chocolate chips',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Chocolate Syrup',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Ice',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Whipped Cream',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'White rice',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Cinnamon Sticks',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Evaporated milk',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'sweetened condensed milk',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
        },
        {
            'name':'Gnocchi',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
            
        },
        {
            'name':'Pecans',
            'calories':None,
            'protein':None,
            'fat':None,
            'carbs':None,
            
        }
        
    ]
    
    for ingredient in ingredients:
        nutrition = fetch_nutritional_vals(ingredient['name'])
        # print("------->",ingredient['name'],nutrition)
        new_ingredient = Ingredient(
            name= ingredient['name'],
            calories= nutrition['calories'] if nutrition else None,
            protein= nutrition['protein'] if nutrition else None,
            fat= nutrition['fat'] if nutrition else None,
            carbs= nutrition['carbs'] if nutrition else None, 
            # serving_size = nutrition['serving_size'] if nutrition else None,
            # serving_size_unit = nutrition['serving_size_unit'] if nutrition else None
        )
        db.session.add(new_ingredient)

    db.session.commit()


def undo_ingredients():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.ingredients RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM ingredients"))

    db.session.commit()