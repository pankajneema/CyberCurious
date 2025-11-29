"""
RabbitMQ / Message Queue Connection
"""

from config.settings import settings
import logging
import json

logger = logging.getLogger(__name__)

# Queue connection
queue_connection = None
queue_channel = None

def get_queue_connection():
    """
    Get RabbitMQ connection (singleton)
    """
    global queue_connection, queue_channel
    
    if queue_connection is None or (queue_connection and queue_connection.is_closed):
        try:
            import pika
            credentials = pika.PlainCredentials(
                settings.RABBITMQ_USER,
                settings.RABBITMQ_PASSWORD
            )
            parameters = pika.ConnectionParameters(
                host=settings.RABBITMQ_HOST,
                port=settings.RABBITMQ_PORT,
                credentials=credentials
            )
            queue_connection = pika.BlockingConnection(parameters)
            queue_channel = queue_connection.channel()
            logger.info("RabbitMQ connected successfully")
        except ImportError:
            logger.warning("pika not installed, RabbitMQ disabled")
            return None, None
        except Exception as e:
            logger.error(f"RabbitMQ connection failed: {e}")
            return None, None
    
    return queue_connection, queue_channel

def publish_message(queue_name: str, message: dict):
    """
    Publish message to queue
    """
    try:
        conn, channel = get_queue_connection()
        if channel is None:
            logger.warning("Queue not available, message not sent")
            return False
        
        # Declare queue
        channel.queue_declare(queue=queue_name, durable=True)
        
        # Publish
        channel.basic_publish(
            exchange='',
            routing_key=queue_name,
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=2,  # Make message persistent
            )
        )
        logger.info(f"Message published to {queue_name}")
        return True
    except Exception as e:
        logger.error(f"Failed to publish message: {e}")
        return False

def consume_messages(queue_name: str, callback):
    """
    Consume messages from queue
    """
    try:
        conn, channel = get_queue_connection()
        if channel is None:
            logger.warning("Queue not available")
            return
        
        channel.queue_declare(queue=queue_name, durable=True)
        channel.basic_consume(
            queue=queue_name,
            on_message_callback=callback,
            auto_ack=True
        )
        logger.info(f"Consuming messages from {queue_name}")
        channel.start_consuming()
    except Exception as e:
        logger.error(f"Failed to consume messages: {e}")

def close_queue():
    """
    Close queue connections
    """
    global queue_connection, queue_channel
    if queue_connection:
        try:
            if not queue_connection.is_closed:
                queue_connection.close()
        except:
            pass
        queue_connection = None
        queue_channel = None
        logger.info("Queue connections closed")

