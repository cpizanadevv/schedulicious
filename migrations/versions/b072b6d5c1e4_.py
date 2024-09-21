"""empty message

Revision ID: b072b6d5c1e4
Revises: 76f20658d4bc
Create Date: 2024-09-20 15:35:22.203861

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")


# revision identifiers, used by Alembic.
revision = 'b072b6d5c1e4'
down_revision = '76f20658d4bc'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('schedules',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('start_date', sa.Date(), nullable=False),
    sa.Column('end_date', sa.Date(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    if environment == "production":
        op.execute(f"ALTER TABLE schedules SET SCHEMA {SCHEMA};")
    op.create_table('schedule_meals',
    sa.Column('recipe_id', sa.Integer(), nullable=False),
    sa.Column('schedule_id', sa.Integer(), nullable=False),
    sa.Column('day_of_week', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['recipe_id'], ['recipes.id'], ),
    sa.ForeignKeyConstraint(['schedule_id'], ['schedules.id'], ),
    sa.PrimaryKeyConstraint('recipe_id', 'schedule_id')
    )
    with op.batch_alter_table('schedule_meals', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key(None, 'recipes', ['recipe_id'], ['id'], ondelete='CASCADE')
        batch_op.create_foreign_key(None, 'ingredients', ['ingredient_id'], ['id'], ondelete='CASCADE')

    with op.batch_alter_table('recipe_tags', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key(None, 'recipes', ['recipe_id'], ['id'], ondelete='CASCADE')
        batch_op.create_foreign_key(None, 'tags', ['tag_id'], ['id'], ondelete='CASCADE')

    if environment == "production":
        op.execute(f"ALTER TABLE ingredients SET SCHEMA {SCHEMA};")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('recipe_tags', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key(None, 'recipes', ['recipe_id'], ['id'])
        batch_op.create_foreign_key(None, 'tags', ['tag_id'], ['id'])

    with op.batch_alter_table('recipe_ingredients', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key(None, 'recipes', ['recipe_id'], ['id'])
        batch_op.create_foreign_key(None, 'ingredients', ['ingredient_id'], ['id'])

    op.drop_table('schedule_meals')
    op.drop_table('schedules')
    # ### end Alembic commands ###