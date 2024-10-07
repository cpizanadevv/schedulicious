from .db import db, environment, SCHEMA, add_prefix_for_prod
from .relationships import schedule_meals
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
        'Recipe', secondary='schedule_meals', back_populates='schedules'
    )
    
    @validates('end_date')
    def validate_dates(self, key, end_date):
        if self.start_date and end_date <= self.start_date:
            raise ValueError('End date must be after the start date.')
        return end_date
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'start_date': self.start_date,
            'end_date': self.end_date
        }