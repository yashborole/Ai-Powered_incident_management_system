"""add column in machines productions

Revision ID: 145551eff527
Revises: 7b6d2c52870b
Create Date: 2026-06-14 16:28:48.667089

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '145551eff527'
down_revision: Union[str, Sequence[str], None] = '7b6d2c52870b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('productions', sa.Column('rejected_qty', sa.Float(), nullable=True))
   

def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('productions', 'rejected_qty')
