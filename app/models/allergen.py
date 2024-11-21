from .db import db, environment, SCHEMA, add_prefix_for_prod

class Allergen(db.Model):
    __tablename__ = 'allergens'
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
    
    id = db.Column(db.Integer, primary_key=True)
    allergen = db.Column(db.String(60), nullable=False)
    
    user = db.relationship('User', secondary='allergies', back_populates='allergic_to', lazy='joined')
    
    def to_dict(self):
        return {
            "id": self.id,
            "allergen": self.allergen,
        }