from flask import Blueprint, request
from flask_login import login_required
from app.models import Recipe, db
from app.forms import RecipeForm

recipe_routes = Blueprint('recipes',__name__)

@recipe_routes.route('/new-recipe', methods=['POST'])
@login_required
def create_recipe():
    form = RecipeForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if 'image' not in request.files:
        return jsonify({"errors": "No file part"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"errors": "No selected file"}), 400

    if file and '.' in file.filename and file.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS:
        file.filename = get_unique_filename(file.filename)
        upload = upload_file_to_s3(file)

        if "url" not in upload:
            return jsonify(upload), 400

        img = upload["url"]
    else:
        return jsonify({"errors": "File type not allowed"}), 400
    
    if form.validate_on_submit:
        recipe = Recipe(
            user_id = form.data['user_id'],
            meal_name = form.data['meal_name'],
            course_type = form.data['course_type'],
            prep_time = form.data['prep_time'],
            cook_time = form.data['cook_time'],
            serving_size = form.data['serving_size'],
            calories = form.data['calories'],
            img = form.data['img']
        )
        db.session.add(recipe)
        db.session.commit()
        return recipe.to_dict()
    else:
        return form.errors,400 
    
@recipe_routes.route('/', methods=['GET'])
def get_all_recipes():
    all_recipes = Recipe.query.all()
    return {'recipes': [recipe.to_dict() for recipe in all_recipes]}

    
@recipe_routes.route('/<int:id>', methods=['GET'])
def get_recipe(id):
    recipe = Recipe.query.get(id)
    return recipe.to_dict()
    