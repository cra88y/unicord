from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
    id = db.Column(db.Integer, primary_key=True)
    imgUrl = db.Column(db.String(300))
    username = db.Column(db.String(16), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    memberships = db.relationship("Membership", back_populates="user")
    servers = db.relationship("Server", back_populates="owner")
    messages = db.relationship("Message", back_populates="user")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def get_server_ids(self):
        server_ids = []
        for m in self.memberships:
            if m.joinable_type == "server":
                server_ids.append(m.joinable_id)
        return server_ids

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'imgUrl': self.imgUrl
        }
