from .db import db, environment, SCHEMA, add_prefix_for_prod



class Tag(db.Model):
    __tablename__ = 'tags'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    tag = db.Column(db.String(50))
    
    

    def to_dict(self):
        return {
            'id': self.id,
            'tag': self.tag,
            
        }
