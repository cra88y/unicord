from app.models.membership import Membership
from .db import db
from sqlalchemy import DateTime
from sqlalchemy.sql import func


class Server(db.Model):
    __tablename__ = 'servers'

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    owner = db.relationship("User", back_populates="servers")
    name = db.Column(db.String(20), nullable=False)
    imgUrl = db.Column(db.String(300))
    channels = db.relationship("Channel", back_populates="server")
    created_at = db.Column(DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(DateTime(timezone=True),
                           onupdate=func.now(), server_default=func.now())

    def delete_self(self):
        for c in self.channels:
            db.session.delete(c)
        db.session.commit()
        db.session.query(Membership).filter(Membership.joinable_id ==
                                            self.id, Membership.joinable_type == "server").delete()
        db.session.delete(self)
        db.session.commit()
        return None

    def get_members(self):
        memberships = db.session.query(Membership).filter(Membership.joinable_id ==
                                                          self.id, Membership.joinable_type == "server").all()
        return {"users": [m.user.to_dict() for m in memberships]}

    def to_dict(self):
        return {
            'id': self.id,
            'owner': self.owner.to_dict(),
            'name': self.name,
            'channels': [c.to_dict() for c in self.channels],
            'members': self.get_members(),
            'imgUrl': self.imgUrl
        }
