from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Tag, db, recipe_tags, Recipe
from app.forms import TagForm

tag_routes = Blueprint('tags', __name__)
#Create tag
@tag_routes.route('/add-tag', methods=['POST'])
@login_required
def add_tag():
    form = TagForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if form.validate_on_submit():
        tag = form.data.get('tag')
        
        if not tag:
            return jsonify({"error": "Tag cannot be empty"}), 400
        
        tag_exists = Tag.query.filter(Tag.tag.like(tag)).one_or_none()
        
        if tag_exists:
            return jsonify(tag_exists.to_dict()), 200
        
        new_tag = Tag(tag=tag)
        db.session.add(new_tag)
        db.session.commit()
        
        return jsonify(new_tag.to_dict()), 201
            
            
            
#Add recipe + tag to joint table 
@tag_routes.route('/<int:recipe_id>/<int:tag_id>/add-recipe-tag', methods=['POST'])
@login_required
def add_recipe_tag(recipe_id,tag_id):
    
    recipe_tag_exists = recipe_tags.query.filter(recipe_tags.recipe_id == recipe_id, recipe_tags.tag_id == tag_id).one_or_none()
    
    if recipe_tag_exists:
        return {'message': 'recipe-Tag relationship already exists'}, 400
    
    
    new_recipe_tag = recipe_tags(
        recipe_id = recipe_id,
        tag_id = tag_id
    )
    
    db.session.add(new_recipe_tag)
    db.session.commit()
    return jsonify({'message': 'recipe-Tag relationship added successfully'}), 201

#Delete Tag
@tag_routes.route('/<int:recipe_id>/<int:tag_id>', methods=['DELETE'])
@login_required
def delete_recipe_tag(recipe_id,tag_id):
    #Current Tag
    #Recipe tag relationship we want to delete
    recipe_tag_to_delete = recipe_tags.query.filter(recipe_tags.tag_id == tag_id, recipe_tags.recipe_id == recipe_id).one_or_none()
    tag_deleted = False
    
    if not recipe_tag_to_delete:
        return jsonify({'error': 'recipe-Tag relationship not found'}), 404
    
    #Checking if tag is being used elsewhere
    tag_usage = recipe_tags.query.filter(recipe_tags.tag_id == tag_id).count()
    if tag_usage == 1:
        curr_tag = Tag.query.filter(Tag.id == tag_id).one_or_none()
        if curr_tag:
            db.session.delete(curr_tag)
            tag_deleted = True
        else:
            return jsonify({'error': 'Tag not found'}), 404

    db.session.delete(recipe_tag_to_delete)
    db.session.commit()
    return "Tag/Recipe-Tag has been deleted"