from sqlalchemy import ForeignKey
from .db import db
from sqlalchemy import DateTime
from sqlalchemy.sql import func


class Message(db.Model):
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("User", back_populates="messages")
    body = db.Column(db.String(255), nullable=False)
    chat_type = db.Column(db.String(20), nullable=False)
    chat_id = db.Column(db.Integer, nullable=False)
    created_at = db.Column(DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(DateTime(timezone=True),
                           onupdate=func.now(), server_default=func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'user': self.user.to_dict(),
            'body': self.body,
        }
