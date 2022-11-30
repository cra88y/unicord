from .db import db, environment, SCHEMA, add_prefix_for_prod


class Conversation(db.Model):
    __tablename__ = 'conversations'
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }
