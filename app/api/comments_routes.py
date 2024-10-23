from flask import Blueprint, jsonify,request
from flask_login import login_required, current_user
from app.models import Comment, Recipe, db
from app.forms import CommentForm


comment_routes = Blueprint('comments',__name__)

@comment_routes.route('/<int:recipe_id>/add-comment',methods=["POST"])
@login_required
def add_comment(recipe_id):
    form = CommentForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    
    recipe = Recipe.query.get(recipe_id)
    if not recipe:
        return jsonify({'errors': 'Recipe not found.'}), 404
    
    if form.validate_on_submit():
        new_comment = {
            'user_id':current_user.id,
            'recipe_id': recipe_id,
            'comment': form.data['comment']
        }
        
        db.session.add(new_comment)
        db.session.commit()
        return new_comment.to_dict(),201
    else:
        return {"errors": form.errors}, 400
    
@comment_routes.route('/<int:recipe_id>/<int:comment_id>/reply',methods=["POST"])
@login_required
def reply_to_comment(recipe_id,comment_id):
    form = CommentForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    
    recipe = Recipe.query.get(recipe_id)
    if not recipe:
        return jsonify({'errors': 'Recipe not found.'}), 404
    
    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({'errors': 'Comment not found.'}), 404
    
    if form.validate_on_submit():
        new_comment = {
            'user_id':current_user.id,
            'recipe_id': recipe_id,
            'parent_comment_id':comment_id,
            'comment': form.data['comment']
        }
        
        db.session.add(new_comment)
        db.session.commit()
        return new_comment.to_dict(),201
    else:
        return {"errors": form.errors}, 400
        
@comment_routes.route('/<int:recipe_id>/comments')
def get_comments(recipe_id):
    comments = Comment.query.filter(Comment.recipe_id == recipe_id)
    
    if not comments:
        return [], 200
    
    return {'comments':[comment.to_dict() for comment in comments]}
        
@comment_routes.route('/<int:comment_id>/edit-comment',methods=["PUT"])
@login_required
def edit_comment(comment_id):
    form = CommentForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    
    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({'errors': 'Comment not found.'}), 404
    
    if form.validate_on_submit():
        comment_to_edit = {
            'user_id':comment.user_id,
            'recipe_id': comment.recipe_id,
            'comment': form.data['comment']
        }
        
        db.session.commit()
        return comment_to_edit.to_dict(),201
    else:
        return {"errors": form.errors}, 400
    
@comment_routes.route('/<int:comment_id>/delete-comment',methods=["DELETE"])
@login_required
def delete_comment(comment_id):
    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({'errors': 'Comment not found.'}), 404
    
    db.session.delete(comment)
    db.session.commit()
    return comment.id