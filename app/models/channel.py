from .db import db


class Channel(db.Model):
    __tablename__ = 'channels'

    id = db.Column(db.Integer, primary_key=True)
    server_id = db.Column(
        db.Integer, db.ForeignKey("servers.id"), nullable=False)
    server = db.relationship("Server", back_populates="channels")
    name = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'chat_type': "channel",
            'chat_id': self.id
            # 'server': self.server.to_dict()
        }
