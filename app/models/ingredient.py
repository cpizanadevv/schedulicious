from .db import db, environment, SCHEMA, add_prefix_for_prod


class Ingredient(db.Model):
    __tablename__ = 'ingredients'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    quantity = db.Column(db.String)

    def to_dict(self):
        return {
            'id': self.id,
            
        }
