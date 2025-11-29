"""
ClickHouse Connection
"""

from config.settings import settings
import logging

logger = logging.getLogger(__name__)

clickhouse_client = None

def get_clickhouse():
    """
    Get ClickHouse client (singleton)
    """
    global clickhouse_client
    
    if clickhouse_client is None:
        try:
            from clickhouse_driver import Client
            clickhouse_client = Client(
                host=settings.CLICKHOUSE_HOST,
                port=settings.CLICKHOUSE_PORT,
                database='cybersentinel'
            )
            # Test connection
            clickhouse_client.execute('SELECT 1')
            logger.info("ClickHouse connected successfully")
        except ImportError:
            logger.warning("clickhouse_driver not installed, ClickHouse disabled")
            return None
        except Exception as e:
            logger.error(f"ClickHouse connection failed: {e}")
            return None
    
    return clickhouse_client

def close_clickhouse():
    """
    Close ClickHouse connection
    """
    global clickhouse_client
    if clickhouse_client:
        try:
            clickhouse_client.disconnect()
        except:
            pass
        clickhouse_client = None
        logger.info("ClickHouse connection closed")

