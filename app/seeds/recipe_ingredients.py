from app.models import db, recipe_ingredients, environment, SCHEMA
from sqlalchemy.sql import text, insert


def seed_recipe_ingredients():
    all_recipe_ingredients = [
        # Recipe 1
        {"recipe_id": 1, "ingredient_id": 1, "quantity": "3 cloves"}, # garlic
        {"recipe_id": 1, "ingredient_id": 2, "quantity": "1"}, # lemon
        {"recipe_id": 1, "ingredient_id": 3, "quantity": "1"}, # scallion
        {"recipe_id": 1, "ingredient_id": 4, "quantity": "1 lb"}, # shrimp
        {"recipe_id": 1, "ingredient_id": 5, "quantity": "a dash"}, # chili flakes
        {"recipe_id": 1, "ingredient_id": 6, "quantity": "4 cups"}, # chicken stock
        {"recipe_id": 1, "ingredient_id": 7, "quantity": "1 cup"}, # arborio rice
        {"recipe_id": 1, "ingredient_id": 8, "quantity": "1 cup"}, # shredded parmesan
        {"recipe_id": 1, "ingredient_id": 20, "quantity": "a dash"}, # salt
        {"recipe_id": 1, "ingredient_id": 21, "quantity": "a dash"}, # pepper
        {"recipe_id": 1, "ingredient_id": 22, "quantity": "1 tbsp"}, # butter
        {"recipe_id": 1, "ingredient_id": 19, "quantity": "a drizzle"}, # olive oil

        # Recipe 2
        {"recipe_id": 2, "ingredient_id": 9, "quantity": "1"}, # zucchini
        {"recipe_id": 2, "ingredient_id": 10, "quantity": "1"}, # roma tomato
        {"recipe_id": 2, "ingredient_id": 1, "quantity": "4 cloves"}, # garlic
        {"recipe_id": 2, "ingredient_id": 11, "quantity": "1 tbsp"}, # Italian seasoning
        {"recipe_id": 2, "ingredient_id": 12, "quantity": "1 tsp"}, # garlic powder
        {"recipe_id": 2, "ingredient_id": 14, "quantity": "2 oz"}, # cream cheese
        {"recipe_id": 2, "ingredient_id": 13, "quantity": "1 large"}, # flatbread
        {"recipe_id": 2, "ingredient_id": 15, "quantity": "measure with your heart"}, # shredded mozzarella
        {"recipe_id": 2, "ingredient_id": 5, "quantity": "a dash"}, # chili flakes
        {"recipe_id": 2, "ingredient_id": 20, "quantity": "a dash"}, # salt
        {"recipe_id": 2, "ingredient_id": 21, "quantity": "a dash"}, # pepper
        {"recipe_id": 2, "ingredient_id": 19, "quantity": "2 tsp"}, # olive oil
        {"recipe_id": 2, "ingredient_id": 22, "quantity": "1 tbsp"}, # butter
        {"recipe_id": 2, "ingredient_id": 48, "quantity": "1 tbsp"}, # all-purpose flour

        # Recipe 3
        {"recipe_id": 3, "ingredient_id": 16, "quantity": "1"}, # yellow onion
        {"recipe_id": 3, "ingredient_id": 1, "quantity": "2 cloves"}, # garlic
        {"recipe_id": 3, "ingredient_id": 10, "quantity": "1"}, # roma tomato
        {"recipe_id": 3, "ingredient_id": 17, "quantity": "6 oz"}, # pork sausage
        {"recipe_id": 3, "ingredient_id": 11, "quantity": "1 tbsp"}, # Italian seasoning
        {"recipe_id": 3, "ingredient_id": 18, "quantity": "3 oz"}, # tomato paste
        {"recipe_id": 3, "ingredient_id": 83, "quantity": "1 container"}, # gnocchi
        {"recipe_id": 3, "ingredient_id": 14, "quantity": "2 oz"}, # cream cheese
        {"recipe_id": 3, "ingredient_id": 15, "quantity": "1 cup"}, # shredded mozzarella
        {"recipe_id": 3, "ingredient_id": 20, "quantity": "a dash"}, # salt
        {"recipe_id": 3, "ingredient_id": 21, "quantity": "a dash"}, # pepper
        {"recipe_id": 3, "ingredient_id": 23, "quantity": "1 tsp"}, # oil
        {"recipe_id": 3, "ingredient_id": 22, "quantity": "1 tbsp"}, # butter

        # Recipe 4
        {"recipe_id": 4, "ingredient_id": 1, "quantity": "2 cloves"}, # garlic
        {"recipe_id": 4, "ingredient_id": 10, "quantity": "1"}, # roma tomato
        {"recipe_id": 4, "ingredient_id": 16, "quantity": "1"}, # yellow onion
        {"recipe_id": 4, "ingredient_id": 24, "quantity": "9 oz"}, # chicken sausage
        {"recipe_id": 4, "ingredient_id": 11, "quantity": "1 tbsp"}, # Italian seasoning
        {"recipe_id": 4, "ingredient_id": 18, "quantity": "3 oz"}, # tomato paste
        {"recipe_id": 4, "ingredient_id": 6, "quantity": "2 1/2 cups"}, # chicken stock
        {"recipe_id": 4, "ingredient_id": 15, "quantity": "1/2 cup"}, # shredded mozzarella
        {"recipe_id": 4, "ingredient_id": 21, "quantity": "a dash"}, # pepper
        {"recipe_id": 4, "ingredient_id": 20, "quantity": "a dash"}, # salt
        {"recipe_id": 4, "ingredient_id": 23, "quantity": "1 tsp"}, # oil

        # Recipe 5
        {"recipe_id": 5, "ingredient_id": 25, "quantity": "12"}, # corn tortillas
        {"recipe_id": 5, "ingredient_id": 23, "quantity": "enough to deep fry and 2 tbsp"}, # oil
        {"recipe_id": 5, "ingredient_id": 26, "quantity": "2"}, # tomatillos
        {"recipe_id": 5, "ingredient_id": 14, "quantity": "1"}, # tomato
        {"recipe_id": 5, "ingredient_id": 34, "quantity": "6 dried"}, # guajillo chiles
        {"recipe_id": 5, "ingredient_id": 27, "quantity": "3 dried"}, # arbol chiles
        {"recipe_id": 5, "ingredient_id": 6, "quantity": "2 1/2 cups"}, # chicken stock
        {"recipe_id": 5, "ingredient_id": 28, "quantity": "1/4 cup chopped"}, # white onion
        {"recipe_id": 5, "ingredient_id": 1, "quantity": "2 cloves"}, # garlic
        {"recipe_id": 5, "ingredient_id": 29, "quantity": "1/8 tsp"}, # cumin seeds
        {"recipe_id": 5, "ingredient_id": 30, "quantity": "1/4 tsp"}, # Mexican oregano
        {"recipe_id": 5, "ingredient_id": 31, "quantity": "2 sprigs"}, # cilantro
        {"recipe_id": 5, "ingredient_id": 20, "quantity": "1 tsp"}, # salt
        {"recipe_id": 5, "ingredient_id": 33, "quantity": "6"}, # eggs
        {"recipe_id": 5, "ingredient_id": 43, "quantity": "1 cup"}, # queso fresco
        {"recipe_id": 5, "ingredient_id": 35, "quantity": "sliced"}, # red onion
        {"recipe_id": 5, "ingredient_id": 44, "quantity": "1 dollop"}, # crema mexicana

        # Recipe 6
        {"recipe_id": 6, "ingredient_id": 36, "quantity": "1 1/2 cup"}, # masa harina
        {"recipe_id": 6, "ingredient_id": 37, "quantity": "1 1/4 cup warm "}, # water
        {"recipe_id": 6, "ingredient_id": 23, "quantity": "4 tbsp"}, # oil
        {"recipe_id": 6, "ingredient_id": 39, "quantity": "1 cup"}, # refried beans
        {"recipe_id": 6, "ingredient_id": 40, "quantity": "2 cups shredded"}, # lettuce
        {"recipe_id": 6, "ingredient_id": 41, "quantity": "1 1/2 cup cooked shredded"}, # beef
        {"recipe_id": 6, "ingredient_id": 42, "quantity": "1 1/2 cup cooked shredded"}, # chicken
        {"recipe_id": 6, "ingredient_id": 43, "quantity": "1/2 cup"}, # queso fresco
        {"recipe_id": 6, "ingredient_id": 28, "quantity": "1/4 cup chopped"}, # white onion
        {"recipe_id": 6, "ingredient_id": 44, "quantity": "1/2 cup"}, # Mexican cream
        {"recipe_id": 6, "ingredient_id": 45, "quantity": "1/3 cup sliced"}, # radish
        {"recipe_id": 6, "ingredient_id": 46, "quantity": "1"}, # avocado
        {"recipe_id": 6, "ingredient_id": 10, "quantity": "1/2 cup diced"}, # tomato
        {"recipe_id": 6, "ingredient_id": 47, "quantity": "if desired"}, # pickled jalapenos

        # Recipe 7
        {"recipe_id": 7, "ingredient_id": 48, "quantity": "2 cups"}, # all-purpose flour
        {"recipe_id": 7, "ingredient_id": 49, "quantity": "1/4 cup + 2 tsp"}, # sugar
        {"recipe_id": 7, "ingredient_id": 50, "quantity": "1 tsp"}, # baking powder
        {"recipe_id": 7, "ingredient_id": 20, "quantity": "1/2 tsp"}, # salt
        {"recipe_id": 7, "ingredient_id": 22, "quantity": "3 tsp melted"}, # butter
        {"recipe_id": 7, "ingredient_id": 33, "quantity": "1 room temperature"}, # egg
        {"recipe_id": 7, "ingredient_id": 51, "quantity": "1 tsp"}, # vanilla extract
        {"recipe_id": 7, "ingredient_id": 37, "quantity": "1/3-1/2 cup"}, # water
        {"recipe_id": 7, "ingredient_id": 52, "quantity": "1/4 cup"}, # cinnamon
        {"recipe_id": 7, "ingredient_id": 23, "quantity": "enough"}, # deep fry oil

        # Recipe 8
        {"recipe_id": 8, "ingredient_id": 53, "quantity": "1/2 cup"}, # whole rolled oats
        {"recipe_id": 8, "ingredient_id": 54, "quantity": "1 tbsp"}, # chia seeds
        {"recipe_id": 8, "ingredient_id": 55, "quantity": "1/2 tsp"}, # maple syrup
        {"recipe_id": 8, "ingredient_id": 56, "quantity": "pinch"}, # sea salt
        {"recipe_id": 8, "ingredient_id": 57, "quantity": "1/4 cup"}, # whole milk Greek yogurt (optional)
        {"recipe_id": 8, "ingredient_id": 58, "quantity": "2/3 cup (milk of choice)"}, # unsweetened almond milk

        # Variations for Recipe 8
        {"recipe_id": 8, "ingredient_id": 61, "quantity": "2 tbsp"}, # unsweetened applesauce (Apple Pie variation)
        {"recipe_id": 8, "ingredient_id": 62, "quantity": "1/4 tsp"}, # cinnamon or apple pie spice (Apple Pie variation)
        {"recipe_id": 8, "ingredient_id": 63, "quantity": "diced apple"}, # diced apple (Apple Pie variation)
        {"recipe_id": 8, "ingredient_id": 84, "quantity": "chopped pecans"}, # chopped pecans (Apple Pie variation)
        {"recipe_id": 8, "ingredient_id": 64, "quantity": "peach slices"}, # peach slices (Peach Crisp variation)
        {"recipe_id": 8, "ingredient_id": 65, "quantity": "granola"}, # granola (Peach Crisp variation)
        {"recipe_id": 8, "ingredient_id": 66, "quantity": "dollop"}, #jam (PB&J variation)
        {"recipe_id": 8, "ingredient_id": 67, "quantity": "peanut butter"}, # peanut butter (PB&J variation)
        {"recipe_id": 8, "ingredient_id": 68, "quantity": "chopped strawberries"}, # chopped strawberries (PB&J variation)
        {"recipe_id": 8, "ingredient_id": 69, "quantity": "raspberries"}, # raspberries (PB&J variation)
        {"recipe_id": 8, "ingredient_id": 70, "quantity": "chopped peanuts"}, # chopped peanuts (PB&J variation)
        {"recipe_id": 8, "ingredient_id": 71, "quantity": "1/2 banana, mashed"}, # mashed banana (Chocolate Banana Bread variation)
        {"recipe_id": 8, "ingredient_id": 72, "quantity": "1 tsp"}, # cocoa powder (Chocolate Banana Bread variation)
        {"recipe_id": 8, "ingredient_id": 73, "quantity": "pinch"}, # nutmeg (Chocolate Banana Bread variation)
        {"recipe_id": 8, "ingredient_id": 74, "quantity": "chopped walnuts"}, # chopped walnuts (Chocolate Banana Bread variation)
        {"recipe_id": 8, "ingredient_id": 75, "quantity": "chocolate chips"}, # chocolate chips (Chocolate Banana Bread variation)

        # Recipe 9
        {"recipe_id": 9, "ingredient_id": 59, "quantity": "1 1/8 cups"}, # milk
        {"recipe_id": 9, "ingredient_id": 49, "quantity": "1 1/2 tbsp"}, # granulated sugar
        {"recipe_id": 9, "ingredient_id": 75, "quantity": "1/3 cup"}, # mini chocolate chips
        {"recipe_id": 9, "ingredient_id": 76, "quantity": "3 tbsp"}, # chocolate syrup
        {"recipe_id": 9, "ingredient_id": 77, "quantity": "1 1/2-2 cups"}, # ice
        {"recipe_id": 9, "ingredient_id": 51, "quantity": "1/4 tsp"}, # vanilla extract
        {"recipe_id": 9, "ingredient_id": 52, "quantity": "pinch"}, # cinnamon
        {"recipe_id": 9, "ingredient_id": 78, "quantity": "as much as you'd like"}, # whipped cream

        # Recipe 10
        {"recipe_id": 10, "ingredient_id": 79, "quantity": "1 cup"}, # uncooked white rice
        {"recipe_id": 10, "ingredient_id": 80, "quantity": "2"}, # cinnamon sticks
        {"recipe_id": 10, "ingredient_id": 81, "quantity": "12 oz"}, # evaporated milk
        {"recipe_id": 10, "ingredient_id": 82, "quantity": "12 oz"}, # sweetened condensed milk
        {"recipe_id": 10, "ingredient_id": 37, "quantity": "8 cups"}, # warm water
        {"recipe_id": 10, "ingredient_id": 49, "quantity": "sugar to taste"}, # sugar
        {"recipe_id": 10, "ingredient_id": 52, "quantity": "ground cinnamon (optional)"}, # ground cinnamon
        {"recipe_id": 10, "ingredient_id": 51, "quantity": "1/2 tsp"}, # vanilla

    ]
    
    for recipe_ingredient in all_recipe_ingredients:
        new_recipe_ingredient = recipe_ingredients.insert().values(
            recipe_id=recipe_ingredient["recipe_id"],
            ingredient_id=recipe_ingredient["ingredient_id"],
            quantity=recipe_ingredient["quantity"]
        )
        db.session.execute(new_recipe_ingredient)
    
    db.session.commit()


def undo_recipe_ingredients():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.recipe_ingredients RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM recipe_ingredients"))

    db.session.commit()
