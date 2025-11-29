"""
Redis Connection
"""

import redis
from config.settings import settings
import logging

logger = logging.getLogger(__name__)

# Redis connection pool
redis_pool = None
redis_client = None

def get_redis():
    """
    Get Redis client (singleton)
    """
    global redis_client, redis_pool
    
    if redis_client is None:
        try:
            import redis
            redis_pool = redis.ConnectionPool.from_url(
                settings.REDIS_URL,
                max_connections=50,
                decode_responses=True
            )
            redis_client = redis.Redis(connection_pool=redis_pool)
            # Test connection
            redis_client.ping()
            logger.info("Redis connected successfully")
        except ImportError:
            logger.warning("redis not installed, Redis disabled")
            return None
        except Exception as e:
            logger.warning(f"Redis connection failed: {e} - Redis disabled")
            # Return None if Redis is not available
            return None
    
    return redis_client

def close_redis():
    """
    Close Redis connections
    """
    global redis_client, redis_pool
    if redis_pool:
        try:
            redis_pool.disconnect()
        except:
            pass
        redis_client = None
        redis_pool = None
        logger.info("Redis connections closed")

