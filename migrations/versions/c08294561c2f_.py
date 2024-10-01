"""empty message

Revision ID: c08294561c2f
Revises: 497460fe2233
Create Date: 2024-09-25 15:31:14.974653

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c08294561c2f'
down_revision = '497460fe2233'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('schedule_meals', schema=None) as batch_op:
        batch_op.alter_column('recipe_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('schedule_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('schedule_meals', schema=None) as batch_op:
        batch_op.alter_column('schedule_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('recipe_id',
               existing_type=sa.INTEGER(),
               nullable=False)

    # ### end Alembic commands ###