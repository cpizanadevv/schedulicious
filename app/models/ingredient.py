from .db import db, environment, SCHEMA, add_prefix_for_prod


class Ingredient(db.Model):
    __tablename__ = "ingredients"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    calories = db.Column(db.Float, nullable=True)
    protein = db.Column(db.Float, nullable=True)
    fat = db.Column(db.Float, nullable=True)
    carbs = db.Column(db.Float, nullable=True)
    # serving_size = db.Column(db.Integer, nullable=True)
    # serving_size_unit = db.Column(db.String, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "calories": self.calories,
            "protein": self.protein,
            "fat": self.fat,
            "carbs": self.carbs,
            # "serving_size":self.serving_size,
            # "serving_size_unit":self.serving_size_unit
        }
