from app.models import db, recipe_tags, environment, SCHEMA, Tag
from sqlalchemy.sql import text, insert


all_recipe_tags = {
    1: ["Seafood", "Soup", "Garlic", "Lemon", "Scallions", "Shrimp", "Chili Flakes", "Chicken Stock", "Arborio Rice", "Shredded Parmesan"],
    2: ["Vegetables", "Italian Seasoning", "Garlic Powder", "Flatbread", "Cream Cheese", "Shredded Mozzarella", "Zucchini", "Roma Tomato", "Chili Flakes", "Salt", "Pepper", "Olive Oil", "Butter"],
    3: ["Vegetables", "Pork Sausage", "Italian Seasoning", "Tomato Paste", "Gnocchi", "Cream Cheese", "Shredded Mozzarella", "Yellow Onion", "Garlic", "Roma Tomato", "Oil", "Butter", "Salt", "Pepper"],
    4: ["Chicken Sausage", "Italian Seasoning", "Tomato Paste", "Chicken Stock", "Shredded Mozzarella", "Garlic", "Roma Tomato", "Yellow Onion", "Oil", "Salt", "Pepper"],
    5: ["Mexican", "Corn Tortillas", "Tomatillos", "Dried Arbol Chiles", "White Onion", "Cumin Seeds", "Mexican Oregano", "Cilantro", "Queso Fresco", "Egg", "Dried Guajillo Chiles", "Red Onion", "Masa Harina", "Refried Beans", "Lettuce", "Beef", "Chicken", "Mexican Cream", "Radish", "Avocado", "Tomato", "Pickled Jalapenos", "Crema Mexicana"],
    6: ["Mexican", "Masa Harina", "Water", "Oil", "Refried Beans", "Shredded Lettuce", "Beef", "Chicken", "Queso Fresco", "Mexican Cream", "Radish", "Avocado", "Diced Tomato", "Pickled Jalapenos"],
    7: ["Baking Powder", "Sugar", "All Purpose Flour", "Butter", "Vanilla Extract", "Cinnamon", "Whole Rolled Oats", "Chia Seeds", "Maple Syrup", "Sea Salt", "Whole Milk Greek Yogurt", "Almond Milk", "Water", "Egg"],
    8: ["Whole Rolled Oats", "Chia Seeds", "Maple Syrup", "Sea Salt", "Whole Milk Greek Yogurt", "Almond Milk", "Oat Milk", "Unsweetened Applesauce", "Apple Pie Spice", "Apple", "Peach", "Granola", "Jam", "Peanut Butter", "Strawberries", "Raspberries", "Peanuts", "Banana", "Cocoa Powder", "Nutmeg", "Walnuts", "Chocolate Chips", "Mini Chocolate Chips"],
    9: ["Sweeteners", "Chocolate Syrup", "Mini Chocolate Chips", "Milk", "Granulated Sugar", "Whipped Cream", "Vanilla Extract", "Ice", "Cinnamon"],
    10: ["Grains", "White Rice", "Cinnamon Sticks", "Evaporated Milk", "Sweetened Condensed Milk", "Vanilla Extract"]
}

def get_tag_id(tag_name):
    tag = Tag.query.filter_by(tag=tag_name).first()
    return tag.id if tag else None

def seed_recipe_tags():
    for recipe_id, tag_names in all_recipe_tags.items():
        for tag_name in tag_names:
            tag_id = get_tag_id(tag_name)
            if tag_id:
                stmt = recipe_tags.insert().values(
                    recipe_id=recipe_id,
                    tag_id=tag_id
                )
                db.session.execute(stmt)
    
    db.session.commit()
    
def undo_recipe_tags():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.recipe_tags RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM recipe_tags"))

    db.session.commit()
