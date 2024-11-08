from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Recipe, db, favorites, User, recipe_ingredients, recipe_tags, Schedule
from app.forms import RecipeForm, RecipeUpdateForm
from sqlalchemy import select
from app.api.aws_helper import upload_file_to_s3, get_unique_filename, allowed_file

recipe_routes = Blueprint("recipes", __name__)


@recipe_routes.route("/new-recipe", methods=["POST"])
@login_required
def create_recipe():
    form = RecipeForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        image = request.files.get("img")
        if not image:
            return ({"errors": "Image file is required"}), 400

        if not allowed_file(image.filename):
            return ({"errors": "File type not permitted"}), 400

        image.filename = get_unique_filename(image.filename)
        upload_result = upload_file_to_s3(image)

        if "url" not in upload_result:
            return ({"errors": upload_result.get("errors", "File upload failed")}), 400
        instructions_list = [
            step.strip() for step in form.instructions.data.split("\n") if step.strip()
        ]
        recipe = Recipe(
            user_id=current_user.id,
            meal_name=form.data["meal_name"],
            course_type=form.data["course_type"],
            prep_time=form.data["prep_time"],
            cook_time=form.data["cook_time"],
            serving_size=form.data["serving_size"],
            instructions=instructions_list,
            img=upload_result["url"],
        )
        db.session.add(recipe)
        db.session.commit()
            
        curr_recipe_id = recipe.id

        db.session.execute(
            favorites.insert().values(user_id=current_user.id, recipe_id=curr_recipe_id)
        )
        db.session.commit()
        return recipe.to_dict()
    else:
        return {"errors": form.errors}, 400


@recipe_routes.route("/update-recipe/<int:recipe_id>", methods=["PUT"])
@login_required
def update_recipe(recipe_id):
    form = RecipeUpdateForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    recipe = Recipe.query.get(recipe_id)

    if not recipe:
        return {"errors": "Recipe not found"}, 404

    if recipe.user_id != current_user.id:
        return {"errors": "Unauthorized"}, 403

    print("RECIPE IMAGE ----->", recipe.img)
    print("FORM IMAGE ----->", form.data["img"])
    if form.validate_on_submit():
        image = request.files.get("img")
        recipe_img = None

        if not form.data["img"]:
            recipe_img = recipe.img
        elif image:
            if not allowed_file(image.filename):
                return ({"errors": "File type not permitted"}), 400

            image.filename = get_unique_filename(image.filename)
            upload_result = upload_file_to_s3(image)

            if "url" not in upload_result:
                return (
                    {"errors": upload_result.get("errors", "File upload failed")}
                ), 400
            recipe_img = upload_result["url"]

        instructions_list = [
            step.strip()
            for step in form.data["instructions"].split("|")
            if step.strip()
        ]

        # print("RECIPE IMAGE ----->", recipe_img)
        recipe.img = recipe_img
        recipe.meal_name = form.data["meal_name"]
        recipe.course_type = form.data["course_type"]
        recipe.prep_time = form.data["prep_time"]
        recipe.cook_time = form.data["cook_time"]
        recipe.serving_size = form.data["serving_size"]
        recipe.instructions = instructions_list

        db.session.commit()

        return recipe.to_dict()
    else:
        return {"errors": form.errors}, 400


@recipe_routes.route("/all-recipes", methods=["GET"])
def get_all_recipes():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 5, type=int)

    recipes = Recipe.query.paginate(page=page, per_page=per_page, error_out=False)
    
    all_recipes = [recipe.to_dict_all() for recipe in recipes.items]

    return jsonify({
        "recipes": all_recipes,
        "total": recipes.total,
        "pages": recipes.pages,
        "per_page": recipes.per_page,
        "current_page": recipes.page,
    })



@recipe_routes.route("/<int:id>", methods=["GET"])
def get_recipe(id):
    recipe = Recipe.query.get(id)
    return recipe.to_dict()


@recipe_routes.route("/<int:recipe_id>/fav", methods=["POST"])
def add_favorite(recipe_id):
    recipe = Recipe.query.get(recipe_id)
    if not recipe:
        return jsonify({"errors": "Recipe not found"}), 404

    if not current_user:
        return jsonify({"errors": "User not found"}), 404

    fav_exists = db.session.execute(
        select([favorites])
        .where(favorites.c.user_id == current_user.id)
        .where(favorites.c.recipe_id == recipe_id)
    ).fetchone()

    if fav_exists:
        return jsonify({"errors": "Recipe already favorited"}), 400

    db.session.execute(
        favorites.insert().values(user_id=current_user.id, recipe_id=recipe_id)
    )
    db.session.commit()
    return jsonify({"message": "Recipe favorited successfully"}), 201


@recipe_routes.route("/<int:recipe_id>/remove-fav", methods=["DELETE"])
def remove_favorite(recipe_id):
    fav = db.session.execute(
        select([favorites])
        .where(favorites.c.user_id == current_user.id)
        .where(favorites.c.recipe_id == recipe_id)
    ).fetchone()

    if not fav:
        return {"errors": "Recipe is not in favorites"}, 404

    db.session.execute(
        favorites.delete()
        .where(favorites.c.user_id == current_user.id)
        .where(favorites.c.recipe_id == recipe_id)
    )

    db.session.commit()
    return jsonify({"message": "Favorite removed"}), 200


@recipe_routes.route("/all-favorites", methods=["GET"])
def get_user_favs():
    if not current_user:
        return jsonify({"errors": "User not found"}), 404

    favs = current_user.favorited_recipes

    if not favs:
        return jsonify([]), 200

    return jsonify([recipe.to_dict() for recipe in favs]), 200

# @recipe_routes.route("/all-favorites", methods=["GET"])
# def get_all_favs():
#     if not current_user:
#         return jsonify({"errors": "User not found"}), 404

#     favs = current_user.favorited_recipes

#     if not favs:
#         return jsonify([]), 200

#     return jsonify([recipe.to_dict() for recipe in favs]), 200


@recipe_routes.route("/<int:recipe_id>/delete", methods=["DELETE"])
def delete_recipe(recipe_id):
    recipe = Recipe.query.get(recipe_id)
    # users = User.query.filter(User.favorited_recipes.any(id=recipe_id)).all()
    # schedules = Schedule.query.filter(Schedule.recipes.any(id=recipe_id)).all()
    if not recipe:
        return {"errors": "Recipe not found"}, 404

    db.session.delete(recipe)
    db.session.commit()
    return recipe.to_dict(), 200  

    # ! Later feature, does not fully delete if recipe is favorited by users
    # fav_count = (
    #     db.session.query(func.count(favorites.c.user_id))
    #     .filter(favorites.c.recipe_id == recipe_id)
    #     .scalar()
    # )
    
    # if fav_count > 1:
    #     db.session.execute(
    #         favorites.delete()
    #         .where(favorites.c.user_id == current_user.id)
    #         .where(favorites.c.recipe_id == recipe_id)
    #     )
    #     db.session.commit()
    # else:
    #     db.session.execute(
    #         favorites.delete()
    #         .where(favorites.c.user_id == current_user.id)
    #         .where(favorites.c.recipe_id == recipe_id)
    #     )
    
