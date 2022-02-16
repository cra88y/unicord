from sqlalchemy import ForeignKey
from .db import db
from sqlalchemy import DateTime
from sqlalchemy.sql import func


class Membership(db.Model):
    __tablename__ = 'memberships'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("User", back_populates="memberships")
    joinable_type = db.Column(db.String(20), nullable=False)
    joinable_id = db.Column(db.Integer, nullable=False)
    created_at = db.Column(DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(DateTime(timezone=True),
                           onupdate=func.now(), server_default=func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'chat_id': self.chat_id
        }
