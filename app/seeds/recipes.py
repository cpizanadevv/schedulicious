from app.models import db, Recipe, environment, SCHEMA
from sqlalchemy.sql import text


def seed_recipes():
    recipes = [
        {
            "user_id": 1,
            "meal_name": "Chili Garlic Shrimp over Risotto",
            "course_type": "Dinner",
            "prep_time": 10,
            "cook_time": 45,
            "serving_size": 2,
            "img": "https://aa-aws-proj-bucket.s3.us-west-2.amazonaws.com/GarlicShrimpRisotto.jpg",
            "instructions": [
                "Wash and dry all produce",
                "Peel and finely chop garlic. Zest and halve lemon. Trim and thinly slice scallions, separating whites from greens.",
                "Rinse shrimp, then pat dr with paper towels. Place in a medium bowl with half the garlic, half the lemon zest, 1/2 tsp of sugar, a drizzle of olive oil, and as many chili flakes as you'd like. Season with salt and pepper. Toss to combine.",
                " In a large pan, melt 1 tbsp of butter over medium-high heat. Add scallion whites and remaining garlic. Cook, stirring, until fragrant (about 1 minute). Add rice and cook, stirring, until rice is translucent( about 1-2 minutes)",
                "Add 1/2 cup of stock to pan with rice. Cook, stirring, until liquid has absorbed. Repeat with remaining stock- adding 1/2 cup at a time, stirring until liquid has absorbed- until rice is al dente and creamy (about 25-30 minutes, depending on the size of your pan, you may need a little more or a little less liquid). Turn off heat, taste and season with salt and pepper",
                "When risotto is almost done, in a second large pan, heat and drizzle olive oil over high heat. Add Shrimp mixture. Cook, flipping once or twice, until shrimp is opaque and cooked through (about 2-3 minutes). Stir in a squeeze of lemon juice.",
                "Stir Parmesan, 1 tbsp butter, and a  squeeze of lemon juice into risotto, until cheese and butter have melted. Taste and season with salt and pepper if needed. Divide risotto between bowls and top with shrimp mixture, scallion greens, remaining lemon zest, and more chili flakes if desired.",
            ],
            "source": None,
        },
        {
            "user_id": 1,
            "meal_name": "Garlicky White Sauce Flatbread",
            "course_type": "Lunch",
            "prep_time": 5,
            "cook_time": 30,
            "serving_size": 2,
            "img": "https://aa-aws-proj-bucket.s3.us-west-2.amazonaws.com/garlicky-white-sauce-flatbreads.png",
            "instructions": [
                "Adjust rack to top position and preheat oven to 450° F. Wash and dry all produce. Trim and halve Zucchini lengthwise, slice crosswise into 1/2-inch thick half-moons. Halve tomato lengthwise, cut crosswise into 1/4-inch thick half-moons. Peel garlic, place garlic cloves in the center of a small piece of foil. Drizzle with olive oil and season with salt and pepper. Cinch into packet.",
                "Toss zucchini on a baking sheet with a drizzle of olive oil, 1 tsp Italian seasoning, salt, and pepper. Place garlic foil packet on the same sheet. Roast on top rack until zucchini is browned and tender (about 12-15 minutes). Meanwhile, place tomatoes in a medium bowl and toss with 1 tsp of Italian seasoning, salt, and pepper. Set aside to marinate.",
                "Once the zucchini is tender transfer to a bowl with tomato. Toss to combine. Keep garlic foil packet on the baking sheet. Place flat breads onto the sheet, then return to top rack until flatbreads are lightly toasted adn garlic is softened (about 5-7 minutes).",
                "While the flatbread toasts, melt 1 tbsp butter in a large pan over medium-high heat. Add 1 tbsp of flour, garlic powder, and Italian seasoning, to taste. Whisk constantly until browned (about 30 seconds). Reduce heat to medium-low and whisk in 1/2 cup of water and cream cheese until melted and combined. Season with sat and pepper, to taste. Simmer until thickened (about 1-2 minutes). Remove from heat.",
                "Once garlic is done, carefully transfer cloves to a cutting board and roughly chop. Heat broiler to high. Evenly top toasted flatbreads with white sauce, roasted garlic, and veggies. Sprinkle with mozzarella.",
                "Broil flatbreads until cheese is melted (about 1-2 minutes). Slice flatbreads into pieces, divide between plates, and sprinkle with chili flakes, if desired.",
            ],
            "source": None,
        },
        {
            "user_id": 1,
            "meal_name": "Italian Pork Sausage Gnocchi Bake",
            "course_type": "Dinner",
            "prep_time": 10,
            "cook_time": 30,
            "serving_size": 2,
            "img": "",
            "instructions": [
                "Heat broiler to high. Bring a medium pot of salted water to a boil. Wash and dry produce. Halve, peel, and finely chop onion. Peel and finely chop garlic. Dice tomato.",
                "In a medium pan, preferably ovenproof, heat a drizzle of oil over medium-high heat. Add onion and season with salt and pepper. Cook, stirring until softened (about 4-5 minutes)",
                "Add sausage, garlic, and Italian seasoning to pan with onion. Cook, breaking up meat into pieces, until the sausage is browned and cooked through (about 4-5 minutes). Srit in diced tomato and tomato paste, season with salt and pepper. Cooking, stirring until tomato is slightly softened (about 2-3 minutes).",
                "Meanwhile, break up the gnocchi with your hands to separate. once water is boiling, carefully add gnocchi to pot. Cook, stirring occasionally until tender (about 3-4 minutes). Reserve at least 1 cup of gnocchi cooking water, then drain",
                "Once gnocchi is drained, stir in cream cheese, 1/2 cup of reserved gnocchi water, and 1 tbsp butter into pan with sausage mixture until thoroughly combined. Add drained gnocchi. Stir to coat.",
                "Taste and season with salt and pepper, if needed. Evenly sprinkle with mozzarella. Broil until cheese is browned and sauce is bubbly (about 2-3 minutes). divide between plates.",
            ],
            "source": None,
        },
        {
            "user_id": 1,
            "meal_name": "Chicken Sausage Tomato Soup with Couscous",
            "course_type": "Lunch",
            "prep_time": 10,
            "cook_time": 35,
            "serving_size": 2,
            "img": "",
            "instructions": [
                "Wash and dry produce. Halve, peel and finely chop onion until you have 3/4 worth. Peel and finely chop garlic. Cut tomato into a medium dice.",
                "Heat a drizzle of oil in a large pot over medium-high heat. Add chopped onion and season with salt and pepper. Cook, stirring until softened (about 4-5 minutes).",
                "Add sausage, garlic, and half the Italian seasoning. Cook, breaking breaking up meat into pieces, until browned and cook through (about 4-6 minutes).",
                "Add diced tomato and tomato paste to pot with sausage mixture. Cook stirring until dice tomato is slightly broken down (about 2-3 minutes). Stir in 2 1/2 cups of chicken stock, and salt and pepper, to taste.",
                "Bring soup to a boil, then stir in couscous. Cook, stirring often, until couscous is al dente (about 8-10 minutes). Taste and season with salt and pepper, to taste.",
                " Divide soup between bowls and sprinkle with cheese, if desired",
            ],
            "source": None,
        },
        {
            "user_id": 1,
            "meal_name": "Chilaquiles",
            "course_type": "Breakfast",
            "prep_time": 10,
            "cook_time": 30,
            "serving_size": 2,
            "img": "",
            "instructions": [
                "Cut each tortilla into 4 wedges. In an electric skillet, heat 1 in. of oil to 350°. Fry tortilla wedges, several at a time, 2-3 minutes on each side or until golden brown. Drain on paper towels.",
                "In a large saucepan, bring 4 cups of water to a boil over medium heat. Add tomatillos, tomato and dried chiles. Boil, uncovered until tomatillos begin to darken, 6-7 minutes. Remove from the heat. Remove tomatillos and tomato to a clean kitchen towel. Let chiles soak in hot water for 15 minutes, then remove to a clean kitchen towel.",
                "Place chiles and 1 cup of broth in a blender. Cover and process until smooth. Strain and discard solids. Place 1 cup remaining broth in same blender (do not need to clean). Add onion, garlic, cumin, oregano, tomatillos and tomato. Cover and process until smooth.",
                "In a large skillet, heat 2 tablespoons vegetable oil over medium heat. Add tomato mixture. Bring to a boil. Reduce heat; simmer, uncovered, 6 minutes. Stir in strained chiles mixture, remaining 1/2 cup broth, epazote sprigs and salt. Return to a boil over medium heat. Reduce heat; simmer, uncovered, 15 minutes. Remove and discard epazote.",
                "Carefully stir in tortillas until evenly coated. Spoon onto serving plates. Top with fried egg, queso fresco and toppings as desired.",
            ],
            "source": "https://www.tasteofhome.com/recipes/chilaquiles/",
        },
        {
            "user_id": 1,
            "meal_name": "Sopes",
            "course_type": "Dinner",
            "prep_time": 10,
            "cook_time": 20,
            "serving_size": 5,
            "img": "",
            "instructions": [
                "Mix Masa harina (corn flour) and warm water in a medium-sized bowl, and knead the dough until you have a uniform texture.",
                "If the dough feels dry, add more water, little by little, spoon by spoon, until the dough is soft and manageable, like play dough. It doesn't have to be sticky. If you live in a place with lots of humidity, the dough won’t need too much water. If that's not your case, make sure the dough has enough moisture to avoid any cracking on the sope's surfaces. ",
                "Cover the dough with a wet kitchen towel; this will help to keep the dough moist. Keep a small bowl of water next to your working area to moisten your hands and dough. (Please check the ingredients list below)",
                "Divide the dough into 10 pieces of the same size, and cover with a clean kitchen towel.",
                "Heat the griddle or cast iron skillet over medium-high heat.",
                "To form the sopes, cut the plastic bag into 2 squares of about 6-IN each. Place one piece of plastic on the Tortilla press, then put down one of the small balls of dough and cover it with the other piece of plastic.",
                "Close the tortillera and press down gently with the tortilla press handle until you form a medium size thick tortilla. About 4-½ inches.",
                "Lift the handle and remove the top plastic. Pick up the tortilla, holding it with the plastic at the bottom, and gently flip the tortilla into the palm of your hand. A large part of the tortilla will cover your hand.",
                "If you don’t have a Tortilla Press, use a glass pie dish to press down the dough; I use it all the time, and it works wonderfully.",
                "Place the tortilla on the already hot griddle/comal; this is a fast but gentle move. ",
                "Turn the tortilla after a minute, don’t let it cook longer, or the dough will dry and crack. Turn again after a minute; the last cooking will take about 20-30 seconds. ",
                "Remove from the griddle with the help of a spatula. Cover the tortillas with a dry kitchen towel and allow them to cool for about 30-45 seconds, and start forming the border by pinching the edges with your fingers. ",
                "Now, the tortillas had become sopes, covered them again with the kitchen towel, and cook the rest of the sopes.",
                "Heat the oil or lard in a frying pan or griddle over medium heat. ",
                "Place the sopes on the skillet and lightly fry them on both sides (about 30 seconds each side will be enough time to fry them and give them a little golden color). Remove from the heat and place on a plate that has already been covered with paper towels to absorb any excess fat.",
                "Now it is the time to spread the refried beans and top them with shredded lettuce, beef, chicken, or any other topping you choose. Serve with salsa.",
            ],
            "source": 'https://www.mexicoinmykitchen.com/sopes-recipe/',
        },
        {
            "user_id": 1,
            "meal_name": "Bunuelos",
            "course_type": "Dessert",
            "prep_time": 25,
            "cook_time": 5,
            "serving_size": 9,
            "img": "",
            "instructions": ["In a large bowl, combine flour, sugar, baking powder and salt. Stir in melted butter, egg and vanilla; mixture will be crumbly. Gradually stir in water, mixing to form a firm ball. Let stand, covered, for 30 minutes. Divide dough into 18 portions; shape each into a ball.","On a lightly floured surface, roll each ball into a thin 6-in. circle. Repeat with remaining dough.","In a large cast-iron skillet or electric griddle, heat oil over medium-high heat. Fry dough circles, 1 at a time, until puffed and golden, about 45 seconds on each side. Drain on paper towels, sprinkle with cinnamon sugar."],
            "source": 'https://www.tasteofhome.com/recipes/bunuelos-recipe/',
        },
        {
            "user_id": 1,
            "meal_name": "Overnight Oats with variations",
            "course_type": "Breakfast",
            "prep_time": 10,
            "cook_time": 0,
            "serving_size": 1,
            "img": "",
            "instructions": ["In a Mason jar or other lidded jar, place the oats, chia seeds, maple syrup, salt, and Greek yogurt, if using. Add milk of choice and stir until the mixture is well combined and there are no clumps of chia seeds at the bottom of the jar. Cover and refrigerate overnight, or for up to 5 days.","In the morning, top with your desired toppings and serve with drizzles of maple syrup.","For apple pie overnight oats, stir the applesauce and cinnamon into the overnight oat base. Refrigerate overnight. In the morning, top with diced apple, chopped pecans, and cinnamon apples and drizzles of maple syrup, if desired.","For peach crisp overnight oats, make the plain overnight oat base. Refrigerate overnight. In the morning, top with peach slices, granola, and drizzles of maple syrup, if desired.","For PB&J overnight oats, make the plain overnight oat base. Refrigerate overnight. In the morning, top with jam, peanut butter, chopped strawberries, raspberries, and chopped peanuts.","For chocolate banana bread overnight oats, stir the mashed banana, cocoa powder, cinnamon, and nutmeg into the overnight oat base. Refrigerate overnight. In the morning, top with banana slices, chopped walnuts, chocolate chips, and drizzles of maple syrup, if desired."],
            "source": "https://www.loveandlemons.com/overnight-oats-recipe/",
        },
        {
            "user_id": 1,
            "meal_name": "Double Chocolate Chip Frappe",
            "course_type": "Drink",
            "prep_time": 5,
            "cook_time": 0,
            "serving_size": 1,
            "img": "",
            "instructions": ["Blend all the ingredients",'Serve, add whipped cream and drizzle chocolate syrup'],
            "source": None,
        },
        {
            "user_id": 1,
            "meal_name": "",
            "course_type": "",
            "prep_time": 10,
            "cook_time": 30,
            "serving_size": 2,
            "img": "",
            "instructions": [""],
            "source": None,
        },
        {
            "user_id": 1,
            "meal_name": "",
            "course_type": "",
            "prep_time": 10,
            "cook_time": 30,
            "serving_size": 2,
            "img": "",
            "instructions": [""],
            "source": None,
        },
    ]

    for recipe in recipes:
        db.session.add(recipe)

    db.session.commit()


def undo_recipes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.recipes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM recipes"))

    db.session.commit()
