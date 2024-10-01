"""empty message

Revision ID: 497460fe2233
Revises: c5887665709b
Create Date: 2024-09-25 15:24:33.688714

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '497460fe2233'
down_revision = 'c5887665709b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('schedule_meals', schema=None) as batch_op:
        batch_op.alter_column('recipe_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('schedule_id',
               existing_type=sa.INTEGER(),
               nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('schedule_meals', schema=None) as batch_op:
        batch_op.alter_column('schedule_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('recipe_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    # ### end Alembic commands ###