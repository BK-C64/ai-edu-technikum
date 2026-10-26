import asyncio
import datetime
import json
import logging
from typing import Dict, List, Any, Optional

import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse # Optional: if we want a root page for the server later

# Configure basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# --- Server Configuration & State ---
SERVER_PASSWORD = "ircAMP2024!"
MAX_MESSAGE_LENGTH = 300

# In-memory storage for active connections and chat history
# Maps WebSocket object to username
active_connections: Dict[WebSocket, str] = {}
# Stores messages as dicts: {"username": "user", "text": "message", "timestamp": "ISO_STRING"}
chat_history: List[Dict[str, str]] = []

# --- Helper Functions ---

def get_current_timestamp() -> str:
    """Returns the current time as an ISO 8601 UTC string."""
    return datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z")

async def broadcast(message: Dict[str, Any], exclude_websocket: Optional[WebSocket] = None):
    """Broadcasts a message to all connected clients, optionally excluding one."""
    # Iterate over a copy of the connections dictionary's items to allow modification during iteration if necessary,
    # though direct modification here is now avoided.
    sockets_to_cleanup_in_main_handler = [] # Sockets that failed and should be handled by the main loop's finally block

    for connection, username in list(active_connections.items()): 
        if connection == exclude_websocket:
            continue
        try:
            await connection.send_text(json.dumps(message))
        except WebSocketDisconnect:
            logger.info(f"Broadcast: Client {username} (or pending auth) disconnected during broadcast attempt.")
            # Mark for cleanup by the main handler, do not remove from active_connections here.
            sockets_to_cleanup_in_main_handler.append(connection) 
        except Exception as e:
            logger.error(f"Error broadcasting to {username if username else 'pending auth'}: {e}")
            # Also mark for cleanup if a generic error occurs, assuming the connection might be compromised.
            sockets_to_cleanup_in_main_handler.append(connection)
    
    # The actual cleanup (removing from active_connections and broadcasting user_left) 
    # should be consistently handled by the finally block in the websocket_endpoint
    # for each respective connection when it properly disconnects or errors out.
    # This list (sockets_to_cleanup_in_main_handler) is mostly for logging/awareness here, 
    # as direct cleanup from broadcast could lead to race conditions or partial cleanups.


async def send_to_websocket(websocket: WebSocket, message: Dict[str, Any]):
    """Sends a JSON message to a specific WebSocket."""
    try:
        await websocket.send_text(json.dumps(message))
    except WebSocketDisconnect:
        logger.info(f"Send: Client disconnected before message could be sent.")
        # Further cleanup should be handled by the main WebSocket handler's disconnect logic
    except Exception as e:
        logger.error(f"Error sending message to a websocket: {e}")


async def handle_disconnect(websocket: WebSocket, username: Optional[str] = None):
    """Handles client disconnection."""
    if username is None and websocket in active_connections:
        username = active_connections[websocket] # Try to get username if not provided

    if websocket in active_connections:
        del active_connections[websocket]
        logger.info(f"Client '{username if username else 'Unknown'}' disconnected. Total active: {len(active_connections)}")
        if username: # Only broadcast if user was fully authenticated
            await broadcast({
                "type": "user_left",
                "payload": {"username": username, "timestamp": get_current_timestamp()}
            })
            # After a user leaves, broadcast the updated user list to all remaining clients
            logger.info(f"Broadcasting updated user list after '{username}' left.")
            await broadcast({
                "type": "user_list",
                "payload": {"users": list(active_connections.values())}
            })
    else:
        logger.info(f"WebSocket disconnected (was not fully authenticated or already removed).")


# --- WebSocket Endpoint ---
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    current_username: Optional[str] = None
    authenticated: bool = False

    try:
        # 1. Password Authentication
        password_message_str = await websocket.receive_text()
        password_message = json.loads(password_message_str)

        if password_message.get("type") == "auth_password" and \
           password_message.get("payload", {}).get("password") == SERVER_PASSWORD:
            logger.info("Password authenticated.")
        else:
            logger.warning("Password authentication failed.")
            await send_to_websocket(websocket, {
                "type": "auth_error",
                "payload": {"reason": "Invalid password."}
            })
            await websocket.close()
            return

        # 2. Username Authentication
        username_message_str = await websocket.receive_text()
        username_message = json.loads(username_message_str)
        
        if username_message.get("type") == "auth_username":
            proposed_username = username_message.get("payload", {}).get("username")
            if not proposed_username or not isinstance(proposed_username, str) or not (3 <= len(proposed_username) <= 20):
                logger.warning(f"Invalid username format: {proposed_username}")
                await send_to_websocket(websocket, {
                    "type": "auth_error",
                    "payload": {"reason": "Invalid username format (must be 3-20 chars)."}
                })
                await websocket.close()
                return

            if proposed_username in active_connections.values():
                logger.warning(f"Username '{proposed_username}' already in use.")
                await send_to_websocket(websocket, {
                    "type": "auth_error",
                    "payload": {"reason": "Nickname already in use."}
                })
                await websocket.close()
                return
            
            current_username = proposed_username
            active_connections[websocket] = current_username
            authenticated = True
            logger.info(f"User '{current_username}' authenticated and connected. Total active: {len(active_connections)}")

            # Send chat history
            await send_to_websocket(websocket, {
                "type": "chat_history",
                "payload": {"messages": chat_history}
            })

            # Send user list to new user
            await send_to_websocket(websocket, {
                "type": "user_list",
                "payload": {"users": list(active_connections.values())}
            })

            # Broadcast user_joined to others
            await broadcast({
                "type": "user_joined",
                "payload": {"username": current_username, "timestamp": get_current_timestamp()}
            }, exclude_websocket=websocket)

            # After a new user joins and existing users are notified, broadcast the updated user list to EVERYONE
            logger.info(f"Broadcasting updated user list after '{current_username}' joined.")
            await broadcast({
                "type": "user_list",
                "payload": {"users": list(active_connections.values())}
            })

        else:
            logger.warning("Username authentication step failed: incorrect message type.")
            await send_to_websocket(websocket, {
                "type": "auth_error",
                "payload": {"reason": "Username authentication protocol error."}
            })
            await websocket.close()
            return

        # 3. Main message loop for authenticated user
        while True:
            try:
                message_str = await websocket.receive_text()
                message_data = json.loads(message_str)
            except json.JSONDecodeError:
                logger.error(f"User '{current_username}' sent message with invalid JSON format.")
                await send_to_websocket(websocket, {
                    "type": "error",
                    "payload": {"message": "Invalid JSON format sent to server."}
                })
                # It might be best to break and let the finally block handle disconnect,
                # as continuing might be problematic if client keeps sending bad JSON.
                break # Exit message loop, will lead to finally block for cleanup
            except WebSocketDisconnect: # Catch disconnect during receive_text itself
                # This will be caught by the outer try-except as well, leading to finally.
                # Logging here can be useful for pinpointing when it happened.
                logger.info(f"WebSocket disconnected for '{current_username}' during message receive.")
                raise # Re-raise to be caught by the outer handler which calls handle_disconnect

            msg_type = message_data.get("type")

            if msg_type == "new_message":
                text_payload = message_data.get("payload", {})
                text = text_payload.get("text") # Ensure payload itself is a dict
                
                if not isinstance(text_payload, dict) or not text or not isinstance(text, str):
                    logger.warning(f"User '{current_username}' sent invalid new_message payload: {text_payload}")
                    await send_to_websocket(websocket, {
                        "type": "error",
                        "payload": {"message": "Invalid message format: payload or text field is invalid."}
                    })
                    continue 
                
                if len(text) > MAX_MESSAGE_LENGTH:
                    logger.warning(f"User '{current_username}' sent message exceeding max length: {len(text)} chars.")
                    # Optionally send an error message back to the sender
                    await send_to_websocket(websocket, {
                        "type": "error", # Generic error type for client
                        "payload": {"message": f"Message too long (max {MAX_MESSAGE_LENGTH} chars)."}
                    })
                    continue

                chat_message = {
                    "username": current_username,
                    "text": text,
                    "timestamp": get_current_timestamp()
                }
                chat_history.append(chat_message)
                # Limit chat history size (e.g., last 100 messages) - OPTIONAL
                # if len(chat_history) > 100:
                #     chat_history.pop(0)

                await broadcast({
                    "type": "new_message",
                    "payload": chat_message
                })
            else:
                logger.warning(f"User '{current_username}' sent unknown message type: {msg_type}")
                # Ignorowanie zgodnie ze specyfikacją, logowanie wykonane

    except WebSocketDisconnect:
        logger.info(f"WebSocketDisconnect for user: '{current_username if current_username else 'Unauthenticated user'}' (outer handler)")
    except json.JSONDecodeError: # This should ideally be caught per-message
        logger.error(f"Failed to decode JSON from user (outer handler, should be rare if caught per-message): '{current_username if current_username else 'Unauthenticated user'}'")
    except Exception as e:
        logger.error(f"Unexpected error for user '{current_username if current_username else 'Unauthenticated user'}': {e}", exc_info=True)
    finally:
        # This will be called on disconnect or any unhandled exception in the try block
        await handle_disconnect(websocket, current_username)


# Optional: A simple HTML page for the root, e.g., to confirm server is running.
# Not part of the core IRC logic.
# @app.get("/")
# async def get():
# return HTMLResponse("<h1>IRC Server is Running</h1><p>Connect via WebSocket at /ws</p>")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info") 