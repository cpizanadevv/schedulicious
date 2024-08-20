from .db import db, environment, SCHEMA, add_prefix_for_prod


class User(db.Model):
    __tablename__ = 'recipes'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    meal_name = db.Column(db.String)
    prep_time = db.Column(db.Integer)
    cook_time = db.Column(db.Integer)
    serving_size = db.Column(db.Integer)
    calories = db.Column(db.Integer)
    img = db.Column(db.URL)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id ,
            'meal_name': self.meal_name ,
            'prep_time': self.prep_time,
            'cook_time': self.cook_time ,
            'serving_size': self.serving_size ,
            'calories': self.calories ,
            'img': self.img ,
        }
