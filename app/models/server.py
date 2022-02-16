from .db import db
from sqlalchemy import DateTime
from sqlalchemy.sql import func


class Server(db.Model):
    __tablename__ = 'servers'

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    owner = db.relationship("User", back_populates="servers")
    name = db.Column(db.String(64), nullable=False)
    channels = db.relationship("Channel", back_populates="server")
    created_at = db.Column(DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(DateTime(timezone=True),
                           onupdate=func.now(), server_default=func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'owner': self.owner.to_dict(),
            'name': self.name,
            'channels': [c.to_dict() for c in self.channels]
        }
