"""
Utilities package
"""

from .database import get_db, init_db, close_db, Base, SessionLocal

# Optional connections - won't fail if not installed
try:
    from .redis_client import get_redis, close_redis
except:
    def get_redis(): return None
    def close_redis(): pass

try:
    from .queue import get_queue_connection, publish_message, consume_messages, close_queue
except:
    def get_queue_connection(): return None, None
    def publish_message(*args, **kwargs): return False
    def consume_messages(*args, **kwargs): pass
    def close_queue(): pass

try:
    from .clickhouse_client import get_clickhouse, close_clickhouse
except:
    def get_clickhouse(): return None
    def close_clickhouse(): pass

__all__ = [
    "get_db",
    "init_db",
    "close_db",
    "Base",
    "SessionLocal",
    "get_redis",
    "close_redis",
    "get_queue_connection",
    "publish_message",
    "consume_messages",
    "close_queue",
    "get_clickhouse",
    "close_clickhouse",
]

