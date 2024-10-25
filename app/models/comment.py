from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user import User
from sqlalchemy.schema import ForeignKey
from sqlalchemy import func
# from datetime import datetime, timezone

class Comment(db.Model):
    __tablename__ = 'comments'
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable =False)
    recipe_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('recipes.id'), ondelete='CASCADE'), nullable =False)
    parent_comment_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('comments.id'), ondelete='CASCADE'), nullable=True)
    comment = db.Column(db.String(1000), nullable=False)
    # created_at = db.Column(db.DateTime, server_default=func.now())
    
    user = db.relationship('User', back_populates='comments')
    recipe = db.relationship('Recipe', back_populates='comments')
    replies = db.relationship('Comment', backref=db.backref('parent', remote_side=[id]), lazy=True)
    
    def to_dict(self):
        return {
            "id": self.id,
            "recipe_id": self.recipe_id,
            "user_id": self.user_id,
            "username": self.user.username,
            "comment": self.comment,
            # 'created_at':self.created_at
        }