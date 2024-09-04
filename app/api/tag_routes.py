from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Tag

tag_routes = Blueprint('tags', __name__)
#Create tag
@tag_routes.route('/add-tag')
@login_required
def add_tag(pin_id):
    form = TagForm
    form['csrf_token'].data = request.cookies['csrf_token']
    curr_pin = Pin.query.filter(Pin.id == pin_id).one_or_none()
    
    if curr_pin and current_user.id == curr_pin.user_id:
         return {'error': 'Pin not found or unauthorized'}, 404
    
    if form.validate_on_submit():
        tag_exists = Tag.query.filter(Tag.tag.like(form.data['tag'])).one_or_none()
        if tag_exists:
            return tag_exists.to_dict()
            
        new_tag = Tag(
            pin_id = pin_id,
            tag = form.data['tag']
        )
        db.session.add(new_tag)
        db.commit()
        
        return new_tag.to_dict()
            
            
            
#Add pin + tag to joint table 
@pin_routes.route('/<int:pin_id>/<int:tag_id>/add-pin-tag')
@login_required
def add_pin_tag(pin_id,tag_id):
    curr_pin = Pin.query.filter(Pin.id == pin_id).one_or_none()
    
    if not curr_pin or curr_pin.user_id != current_user.id:
        return {'error': 'Pin not found'}, 404
    
    curr_tag = Tag.query.filter(Tag.id == tag_id).one_or_none()
    if not curr_tag:
        return {'message': 'Tag not found'}, 404   
    
    pin_tag_exists = pin_tags.query.filter(pin_tags.pin_id == pin_id, pin_tags.tag_id == tag_id).one_or_none()
    
    if pin_tag_exists:
        return {'message': 'Pin-Tag relationship already exists'}, 400
    
    new_pin_tag = pin_tags(
        pin_id = pin_id,
        tag_id = curr_tag.tag_id
    )
    
    db.session.add(new_pin_tag)
    db.session.commit()
    return {'message': 'Pin-Tag relationship added successfully'}, 201

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