"""add_hashed_password

Revision ID: add_hashed_password
Revises: 7214fd465ce0
Create Date: 2026-06-13 15:10:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'add_hashed_password'
down_revision: Union[str, Sequence[str], None] = '7214fd465ce0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('hashed_password', sa.String(length=255), nullable=True))

def downgrade() -> None: 
    op.drop_column('users', 'hashed_password')
   
