from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Recipe, db
from app.forms import RecipeForm, ImageForm
from app.api.aws_helper import  upload_file_to_s3, get_unique_filename, allowed_file

recipe_routes = Blueprint("recipes", __name__)


@recipe_routes.route("/new-recipe", methods=["POST"])
@login_required
def create_recipe():
    form = RecipeForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    
    if form.validate_on_submit():
        image = request.files.get('image')
        if not image:
            return ({"errors": "Image file is required"}), 400

        if not allowed_file(image.filename):
            return ({"errors": "File type not permitted"}), 400

        image.filename = get_unique_filename(image.filename)
        upload_result = upload_file_to_s3(image)

        if 'url' not in upload_result:  
            return ({"errors": upload_result.get('errors', 'File upload failed')}), 400
        instructions_list = [
            step.strip() for step in form.instructions.data.split("\n") if step.strip()
        ]
        recipe = Recipe(
            user_id= current_user.id,
            meal_name=form.data["meal_name"],
            course_type=form.data["course_type"],
            prep_time=form.data["prep_time"],
            cook_time=form.data["cook_time"],
            serving_size=form.data["serving_size"],
            instructions=instructions_list,
            img=upload_result['url'],
        )
        db.session.add(recipe)
        db.session.commit()
        
        return recipe.to_dict()
    else:
        return {'errors': form.errors}, 400


@recipe_routes.route("/all-recipes", methods=["GET"])
def get_all_recipes():
    all_recipes = Recipe.query.all()
    return {"recipes": [recipe.to_dict() for recipe in all_recipes]}
    # page = request.args.get("page", 1, type=int)
    # per_page = request.args.get("per_page", 10, type=int)

    # course_type = request.args.get("course_type")
    # prep_time_min = request.args.get("prep_time_min", type=int)
    # prep_time_max = request.args.get("prep_time_max", type=int)

    # query = Recipe.query
    # if course_type:
    #     query = query.filter_by(course_type=course_type)
    # if prep_time_min is not None:
    #     query = query.filter(Recipe.prep_time >= prep_time_min)
    # if prep_time_max is not None:
    #     query = query.filter(Recipe.prep_time <= prep_time_max)

    # all_recipes = query.paginate(page, per_page, False)

    # return {
    #     "recipes": [recipe.to_dict() for recipe in all_recipes.items],
    #     "total": all_recipes.total,
    #     "pages": all_recipes.pages,
    #     "page": all_recipes.page,
    #     "per_page": all_recipes.per_page,
    # }


@recipe_routes.route("/<int:id>", methods=["GET"])
def get_recipe(id):
    recipe = Recipe.query.get(id)
    return recipe.to_dict()
