from .db import db, environment, SCHEMA, add_prefix_for_prod
from .relationships import schedule_meals
from .recipe import Recipe
from sqlalchemy.orm import validates


class Schedule(db.Model):
    __tablename__ = 'schedules'
    
    if environment == "production":
        __table_args__ = {"schema": SCHEMA}
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    start_date = db.Column(db.Date, nullable=False,unique=True)
    end_date = db.Column(db.Date, nullable=False,unique=True)
    
    user = db.relationship("User", back_populates="schedules")
    recipes = db.relationship(
    'Recipe', secondary=schedule_meals,
    backref=db.backref("schedule_meals", lazy="select",passive_deletes=True)
)
    
    @validates('end_date')
    def validate_dates(self,key,end_date):
        # print('END', end_date)
        # print('END', self.start_date)
        if end_date <= self.start_date:
            raise ValueError('End date must be after the start date.')
        return end_date
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'start_date': self.start_date.strftime("%x"),
            'end_date': self.end_date.strftime("%x"),
        }