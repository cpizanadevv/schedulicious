from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Tag, db, recipe_tags
from app.forms import TagForm

tag_routes = Blueprint('tags', __name__)
#Create tag
@tag_routes.route('/add-tag')
@login_required
def add_tag():
    form = TagForm
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if form.validate_on_submit():
        tag_exists = Tag.query.filter(Tag.tag.like(form.data['tag'])).one_or_none()
        if tag_exists:
            return tag_exists.to_dict()
            
        new_tag = Tag(
            tag = form.data['tag']
        )
        db.session.add(new_tag)
        db.commit()
        
        return new_tag.to_dict()
            
            
            
#Add pin + tag to joint table 
@tag_routes.route('/<int:pin_id>/<int:tag_id>/add-pin-tag')
@login_required
def add_recipe_tag(pin_id,tag_id):
    curr_recipe = recipe_tags.query.filter(recipe.id == recipe_id and tag_id == tag_id).one_or_none()
    
    if not curr_recipe or curr_recipe.user_id != current_user.id:
        return {'error': 'recipe not found'}, 404
    
    curr_tag = Tag.query.filter(Tag.id == tag_id).one_or_none()
    if not curr_tag:
        return {'message': 'Tag not found'}, 404   
    
    recipe_tag_exists = recipe_tags.query.filter(recipe_tags.recipe_id == recipe_id, recipe_tags.tag_id == tag_id).one_or_none()
    
    if recipe_tag_exists:
        return {'message': 'recipe-Tag relationship already exists'}, 400
    
    new_recipe_tag = recipe_tags(
        recipe_id = recipe_id,
        tag_id = curr_tag.tag_id
    )
    
    db.session.add(new_recipe_tag)
    db.session.commit()
    return {'message': 'recipe-Tag relationship added successfully'}, 201

#Delete Pin Tag
@pin_routes.route('/<int:pin_id>/<int:tag_id>', methods=['DELETE'])
@login_required
def delete_pin_tag(pin_id,tag_id):
    #Current Tag
    #Pin tag relationship we want to delete
    pin_tag_to_delete = pin_tags.query.filter(pin_tags.tag_id == tag_id, pin_tags.pin_id == pin_id).one_or_none()

    
    curr_pin = Pin.query.filter(Pin.id == pin_id).one_or_none()
    
    
    if not curr_pin or curr_pin.user_id != current_user.id:
        return {'error': 'Pin not found or unauthorized'}, 404
    
    if not pin_tag_to_delete:
        return {'error': 'Pin-Tag relationship not found'}, 404
    
    #Checking if tag is being used elsewhere
    tag_usage = pin_tags.query.filter(pin_tags.tag_id == tag_id).count()
    if tag_usage == 1:
        curr_tag = Tag.query.filter(Tag.id == tag_id).one_or_none()
        if curr_tag:
            db.session.delete(curr_tag)
            db.session.commit()
        else:
            return {'error': 'Tag not found'}, 404

    db.session.delete(pin_tag_to_delete)
    db.session.commit()
    return "Tag/Pin-Tag has been deleted"