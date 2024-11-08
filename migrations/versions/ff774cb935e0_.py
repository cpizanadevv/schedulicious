"""empty message

Revision ID: ff774cb935e0
Revises: b49ea166d18d
Create Date: 2024-11-08 13:24:12.961046

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ff774cb935e0'
down_revision = 'b49ea166d18d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('comments', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('comments', schema=None) as batch_op:
        batch_op.drop_column('created_at')

    # ### end Alembic commands ###
