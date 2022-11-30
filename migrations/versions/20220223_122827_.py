"""empty message

Revision ID: 5143d84159ec
Revises: b75dde0125ef
Create Date: 2022-02-23 12:28:27.298710

"""
from alembic import op
import sqlalchemy as sa
import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# revision identifiers, used by Alembic.
revision = '5143d84159ec'
down_revision = 'b75dde0125ef'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('servers', sa.Column('imgUrl', sa.String(length=300), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('servers', 'imgUrl')
    # ### end Alembic commands ###
