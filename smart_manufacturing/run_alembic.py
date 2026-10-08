import sys
import os
sys.path.append(os.getcwd())
import alembic.config
alembicArgs = ['--raiseerr', 'upgrade', 'head']
alembic.config.main(argv=alembicArgs)
