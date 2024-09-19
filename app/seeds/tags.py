from app.models import db, Tag, environment, SCHEMA
from sqlalchemy.sql import text


def seed_tags():
    all_tags = [
        {"tag": "Dairy"},
        {"tag": "Shellfish"},
        {"tag": "Soup"},
        {"tag": "Mexican"},
        {"tag": "Garlic"},
        {"tag": "Lemon"},
        {"tag": "Scallions"},
        {"tag": "Shrimp"},
        {"tag": "Chili Flakes"},
        {"tag": "Chicken Stock"},
        {"tag": "Arborio Rice"},
        {"tag": "Shredded Parmesan"},
        {"tag": "Zucchini"},
        {"tag": "Roma Tomato"},
        {"tag": "Italian Seasoning"},
        {"tag": "Garlic Powder"},
        {"tag": "Flatbread"},
        {"tag": "Cream Cheese"},
        {"tag": "Shredded Mozzarella"},
        {"tag": "Yellow Onion"},
        {"tag": "Pork Sausage"},
        {"tag": "Tomato Paste"},
        {"tag": "Olive Oil"},
        {"tag": "Salt"},
        {"tag": "Pepper"},
        {"tag": "Butter"},
        {"tag": "Oil"},
        {"tag": "Chicken Sausage"},
        {"tag": "Corn Tortillas"},
        {"tag": "Tomatillos"},
        {"tag": "Dried Arbol Chiles"},
        {"tag": "White Onion"},
        {"tag": "Cumin Seeds"},
        {"tag": "Mexican Oregano"},
        {"tag": "Cilantro"},
        {"tag": "Cotija Cheese"},
        {"tag": "Egg"},
        {"tag": "Dried Guajillo Chiles"},
        {"tag": "Red Onion"},
        {"tag": "Masa Harina"},
        {"tag": "Water"},
        {"tag": "Lard"},
        {"tag": "Refried Beans"},
        {"tag": "Lettuce"},
        {"tag": "Beef"},
        {"tag": "Chicken"},
        {"tag": "Queso Fresco"},
        {"tag": "Mexican Cream"},
        {"tag": "Radish"},
        {"tag": "Avocado"},
        {"tag": "Tomato"},
        {"tag": "Pickled Jalapenos"},
        {"tag": "All Purpose Flour"},
        {"tag": "Sugar"},
        {"tag": "Baking Powder"},
        {"tag": "Vanilla Extract"},
        {"tag": "Cinnamon"},
        {"tag": "Whole Rolled Oats"},
        {"tag": "Chia Seeds"},
        {"tag": "Maple Syrup"},
        {"tag": "Sea Salt"},
        {"tag": "Whole Milk Greek Yogurt"},
        {"tag": "Almond Milk"},
        {"tag": "Oat Milk"},
        {"tag": "Unsweetened Applesauce"},
        {"tag": "Apple Pie Spice"},
        {"tag": "Apple"},
        {"tag": "Peach"},
        {"tag": "Granola"},
        {"tag": "Jam"},
        {"tag": "Peanut Butter"},
        {"tag": "Strawberries"},
        {"tag": "Raspberries"},
        {"tag": "Peanuts"},
        {"tag": "Banana"},
        {"tag": "Cocoa Powder"},
        {"tag": "Nutmeg"},
        {"tag": "Walnuts"},
        {"tag": "Chocolate Chips"},
        {"tag": "Mini Chocolate Chips"},
        {"tag": "Chocolate Syrup"},
        {"tag": "Ice"},
        {"tag": "Whipped Cream"},
        {"tag": "White Rice"},
        {"tag": "Cinnamon Sticks"},
        {"tag": "Evaporated Milk"},
        {"tag": "Sweetened Condensed Milk"},
        {"tag": "Seafood"},
        {"tag": "Vegetables"},
        {"tag": "Herbs and Spices"},
        {"tag": "Cheese"},
        {"tag": "Grains"},
        {"tag": "Bread"},
        {"tag": "Sauces and Condiments"},
        {"tag": "Sweeteners"},
    ]

    for tag in all_tags:
        new_tag = Tag(tag=tag["tag"])
        db.session.add(new_tag)

    db.session.commit()


def undo_tags():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tags RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM tags"))

    db.session.commit()
