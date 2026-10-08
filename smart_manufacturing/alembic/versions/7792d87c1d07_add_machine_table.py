"""add machine table

Revision ID: 7792d87c1d07
Revises: 82c91d46ab96
Create Date: 2026-06-14 12:41:12.716802

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7792d87c1d07'
down_revision: Union[str, Sequence[str], None] = '82c91d46ab96'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('machines',
    sa.Column('mc_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('plant_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['plant_id'], ['plants.id'], ),
    sa.PrimaryKeyConstraint('mc_id')
    )
    op.create_index(op.f('ix_machines_mc_id'), 'machines', ['mc_id'], unique=False)

def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_machines_mc_id'), table_name='machines')
    op.drop_table('machines')
   
