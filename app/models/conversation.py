from .db import db


class Conversation(db.Model):
    __tablename__ = 'conversations'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }
