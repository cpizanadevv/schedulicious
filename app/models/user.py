from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy import ARRAY
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy import String


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    profile_img = db.Column(db.String(255), nullable=True)
    allergies = db.Column(MutableList.as_mutable(ARRAY(String)), nullable=True)
    
    recipes = db.relationship('Recipe', back_populates='user', lazy='joined')
    # schedules = db.relationship('Schedule', back_populates='user')
    favorited_recipes = db.relationship('Recipe', secondary='favorites', backref='favorited_by')
    comments = db.relationship('Comment', back_populates='user', cascade='all, delete')
    
    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }
        
    def to_dict_all(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'profile_img': self.profile_img,
            'allergies': self.allergies
        }
