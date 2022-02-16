from .db import db
from sqlalchemy import DateTime
from sqlalchemy.sql import func


class Friendship(db.Model):
    __tablename__ = 'friendships'

    id = db.Column(db.Integer, primary_key=True)
    user1_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    # user1 = db.relationship("User", back_populates="friends")
    user2_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    # user2 = db.relationship("User", foreign_keys=[
    #     user2_id])
    status = db.Column(db.String(64), nullable=False)
    created_at = db.Column(DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(DateTime(timezone=True),
                           onupdate=func.now(), server_default=func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'user1_id': self.user1_id,
            'user2_id': self.user2_id
        }
