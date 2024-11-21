# Scheduliscious

Schedulicious is a platform designed to help users share and organize recipes, as well as plan and track their meals. Inspired by the need for an intuitive and user-friendly meal management tool, Schedulicious offers a seamless interface where users can discover new recipes, save their favorites, and schedule them for specific dates. The website’s clean design focuses on ease of use, allowing users to effortlessly navigate through meal planning and recipe sharing, ensuring a more organized approach to cooking and meal preparation.

## Live Link

[https://schedulicious.onrender.com]

## Tech Stack

#### Frameworks | Libraries | API

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Flask](https://img.shields.io/badge/Flask-black?style=for-the-badge&logo=flask)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![HTML](https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![FoodCentral API](https://img.shields.io/badge/Food_Central-05A081?style=for-the-badge&logo=foodcentral&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon&logoColor=white)

#### Database

![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

#### Hosting

![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

## Index

[Featurelist](https://github.com/cpizanadevv/schedulicious/wiki/MVP-Feature-List) | 
[Schema](https://github.com/cpizanadevv/schedulicious/wiki/Schema) | 
[User Stories](https://github.com/cpizanadevv/schedulicious/wiki/User-Stories)


### Recipes

#### **`POST /new-recipe`**  
Creates a new recipe for the authenticated user.

**Successful Response:**

```json
{
  "id": 1,
  "user_id": 1,
  "meal_name": "Spaghetti Carbonara",
  "course_type": "Main",
  "prep_time": "10 mins",
  "cook_time": "20 mins",
  "serving_size": 4,
  "instructions": ["Step 1", "Step 2"],
  "img": "https://example.com/image.jpg"
}
```

**Error Response:**

```json
{
  "errors": "Image file is required"
}

{
  "errors": "File type not permitted"
}
```

#### **`PUT /update-recipe/<int:recipe_id>`**  
Updates a recipe created by the authenticated user.

**Successful Response:**

```json
{
  "id": 1,
  "meal_name": "Updated Recipe Name",
  "course_type": "Main",
  "prep_time": "15 mins",
  "cook_time": "25 mins",
  "serving_size": 2,
  "instructions": ["Updated step 1", "Updated step 2"],
  "img": "https://example.com/updated_image.jpg"
}
```

**Error Response:**

```json
{
  "errors": "Unauthorized"
}

{
  "errors": "Recipe not found"
}
```

#### **`GET /all-recipes`**  
Retrieves all recipes with pagination and optional query filtering.
Query Parameters:

* page (default: 1)
* per_page (default: 5)
* query (optional): Filters recipes by meal name, course type, ingredients, or tags.

**Successful Response:**

```json
{
  "recipes": [
    {
      "id": 1,
      "meal_name": "Spaghetti Carbonara",
      "course_type": "Main",
      "prep_time": "10 mins",
      "cook_time": "20 mins",
      "serving_size": 4,
      "instructions": ["Step 1", "Step 2"],
      "img": "https://example.com/image.jpg"
    }
  ],
  "total": 10,
  "pages": 2,
  "per_page": 5,
  "current_page": 1
}
```

#### **`GET /<int:id>`**  
Retrieves a specific recipe by ID.

**Successful Response:**

```json
{
  "id": 1,
  "meal_name": "Spaghetti Carbonara",
  "course_type": "Main",
  "prep_time": "10 mins",
  "cook_time": "20 mins",
  "serving_size": 4,
  "instructions": ["Step 1", "Step 2"],
  "img": "https://example.com/image.jpg"
}
```

**Error Response:**

```json
{
  "errors": "Recipe not found"
}

{
  "errors": "Recipe already favorited"
}
```

#### **`DELETE /<int:recipe_id>/remove-fav`**  
Removes a recipe from the authenticated user's favorites.

**Successful Response:**

```json
{
  "message": "Favorite removed"
}
```

**Error Response:**

```json
{
  "errors": "Recipe is not in favorites"
}
```

#### **`GET /all-favorites`**  
Retrieves all favorite recipes for the authenticated user.

**Successful Response:**

```json
[
  {
    "id": 1,
    "meal_name": "Spaghetti Carbonara",
    "course_type": "Main",
    "prep_time": "10 mins",
    "cook_time": "20 mins",
    "serving_size": 4,
    "instructions": ["Step 1", "Step 2"],
    "img": "https://example.com/image.jpg"
  }
]
```

**Error Response:**

```json
{
  "errors": "User not found"
}
```

#### **`DELETE /<int:recipe_id>/delete`**  
Deletes a recipe created by the authenticated user.


**Successful Response:**

```json
{
  "id": 1,
  "meal_name": "Spaghetti Carbonara",
  "course_type": "Main",
  "prep_time": "10 mins",
  "cook_time": "20 mins",
  "serving_size": 4,
  "instructions": ["Step 1", "Step 2"],
  "img": "https://example.com/image.jpg"
}
```

**Error Response:**

```json
{
  "errors": "Recipe not found"
}
```
### Ingredients

#### **`POST /add-ingredient`**  
Adds a new ingredient or retrieves an existing one if it already exists.

**Successful Response:**

```json
{
  "id": 1,
  "name": "Chicken Breast",
  "calories": 165,
  "protein": 31,
  "fat": 3.6,
  "carbs": 0
}
```

**Error Response:**

```json
{
  "errors": {
    "name": ["This field is required."]
  }
}

```
#### **`POST /add-recipe-ingredient/<int:recipe_id>/<int:ingredient_id>`**  
Adds an ingredient to a recipe with a specified quantity.

**Successful Response:**

```json
{
  "recipe_id": 1,
  "ingredient_id": 2,
  "quantity": "200g"
}
```
**Error Response:**

```json
{
  "errors": "Recipe not found."
}

{
  "errors": "Ingredient not found."
}

{
  "errors": {
    "quantity": ["This field is required."]
  }
}

```
#### **`DELETE /<int:recipe_id>/<int:ingredient_id>/delete-recipe-ingredient`**  
Removes a specific ingredient from a recipe.

**Successful Response:**

```json
{
  "message": "recipe-ingredient deleted successfully"
}
```
**Error Response:**

```json
{
  "error": "recipe-ingredient relationship not found"
}

```
#### **`DELETE /<int:recipe_id>/delete-all-recipe-ingredient`**  
Removes all ingredients from a specific recipe.

**Error Response:**
```json
{
  "error": "Recipe not found"
}

```

### Comments

#### **`POST /<int:recipe_id>/add-comment`**  
Adds a new comment to a recipe.

**Successful Response:**

```json
{
  "id": 1,
  "user_id": 1,
  "recipe_id": 1,
  "comment": "This is a sample comment",
  "created_at": "2024-11-20T16:31:14"
}

```
**Error Response:**

```json
{
  "errors": {
    "comment": ["This field is required."]
  }
}

```
#### **`GET /<int:recipe_id>/comments`**  
Retrieves all comments for a specific recipe, with pagination.

**Successful Response:**

```json
{
  "comments": [
    {
      "id": 1,
      "user_id": 1,
      "recipe_id": 1,
      "comment": "This is a sample comment",
      "created_at": "2024-11-20T16:31:14",
      "updated_at": "2024-11-20T16:31:14"
    }
  ],
  "total": 1,
  "pages": 1,
  "current_page": 1
}

```
**Error Response:**

```json
{
  "error": "Page not found."
}

```
#### **`PUT /<int:comment_id>/edit-comment`**  
Edits an existing comment.

**Successful Response:**

```json
{
  "id": 1,
  "user_id": 1,
  "recipe_id": 1,
  "comment": "This is an updated comment",
  "created_at": "2024-11-20T16:31:14",
  "updated_at": "2024-11-20T16:35:14"
}

```
**Error Response:**

```json
{
  "errors": {
    "comment": ["This field is required."]
  }
}

```
#### **`DELETE /<int:comment_id>/delete-comment`**  
Edits an existing comment.

**Successful Response:**

```json
{
  "deleted_comment_id": 1
}

```
**Error Response:**

```json
{
  "errors": "Comment not found."
}

```

### Schedule Meals

#### **`POST /<int:recipe_id>/<date>/add`**  
Adds a recipe to the schedule for a specific date.

**Successful Response:**

```json
{
  "recipe_id": 1,
  "date": "2024-11-20",
  "day_of_week": "Monday"
}

```
**Error Response:**

```json
{
  "errors": "Recipe not found"
}

```

#### **`GET /<date>/<day_of_week>/meals`**  
Gets all meals for a specific date and day of the week.

**Successful Response:**

```json
{
  "1": {
    "recipe_id": 1,
    "meal_name": "Spaghetti Bolognese",
    "img": "image_url"
  },
  "2": {
    "recipe_id": 2,
    "meal_name": "Grilled Chicken",
    "img": "image_url"
  }
}
```
**Error Response:**

```json
{
  "errors": "Recipe not found"
}

```
#### **`GET /<int:month>/<int:year>/meals`**  
Gets all meals for a specific month and year.

**Successful Response:**

```json
{
  "1": {
    "recipe_id": 1,
    "meal_name": "Spaghetti Bolognese",
    "date": "2024-11-20"
  },
  "2": {
    "recipe_id": 2,
    "meal_name": "Grilled Chicken",
    "date": "2024-11-21"
  }
}
```
**Error Response:**

```json
{
  "errors": "Recipe not found"
}

```
#### **`DELETE /<date>/<int:recipe_id>/delete`**  
Deletes a meal for a specific date and recipe.

**Successful Response:**

```json
{
  "recipe_id": 1,
  "date": "2024-11-20",
  "day_of_week": "Monday"
}
```
**Error Response:**

```json
{
  "errors": "Meal not found"
}

```

### Tags

#### **`POST /add-tag`**  
Adds a new tag to the system.

**Successful Response:**

```json
{
  "id": 1,
  "tag": "Vegetarian"
}
```
**Error Response:**

```json
{
  "error": "Tag cannot be empty"
}

```
#### **`POST /<int:recipe_id>/<int:tag_id>/add-recipe-tag`**  
Adds a recipe-tag relationship.

**Successful Response:**

```json
{
  "recipe_id": 1,
  "tag_id": 2
}
```
**Error Response:**

```json
{
  "errors": "Recipe not found."
}

```

#### **`DELETE /<int:recipe_id>/<int:tag_id>`**  
Adds a recipe-tag relationship.

**Successful Response:**

```json
{
  "message": "Tag/Recipe-Tag has been deleted"
}
```
**Error Response:**

```json
{
  "error": "recipe-Tag relationship not found"
}

```
