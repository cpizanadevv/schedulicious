"""empty message

Revision ID: cb4814a418de
Revises: 2a2cd70a375b
Create Date: 2024-12-03 16:36:13.792140

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cb4814a418de'
down_revision = '2a2cd70a375b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('schedule_meals', schema=None) as batch_op:
        batch_op.drop_column('day_of_week')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('schedule_meals', schema=None) as batch_op:
        batch_op.add_column(sa.Column('day_of_week', sa.VARCHAR(), nullable=False))

    # ### end Alembic commands ###
