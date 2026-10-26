"""
Zarządzanie połączeniami WebSocket i obsługa zdarzeń.

Ten moduł zawiera:
- ConnectionManager: zarządzanie sesjami użytkowników
- Funkcje obsługi zdarzeń: autentykacja, wysyłanie wiadomości, historia
- Walidacja danych wejściowych
"""

import json
import re
from typing import Dict, List, Optional
from fastapi import WebSocket

from database import (
    get_user_by_username,
    get_all_channels,
    get_messages_for_channel,
    add_message
)


class ConnectionManager:
    """
    Zarządzanie połączeniami WebSocket i sesjami użytkowników.

    Śledzi:
    - Aktywne połączenia WebSocket
    - Informacje o zalogowanych użytkownikach
    - Aktualny kanał każdego użytkownika
    """

    def __init__(self):
        # Mapowanie: WebSocket -> informacje o użytkowniku
        self.active_connections: Dict[WebSocket, Dict[str, str]] = {}
        # Zbiór zalogowanych nazw użytkowników (dla szybkiego sprawdzania duplikatów)
        self.online_usernames: set = set()

    def connect(self, websocket: WebSocket, user_id: str, username: str, channel_id: str = "general"):
        """
        Rejestruje nowe połączenie użytkownika.

        Args:
            websocket: Obiekt WebSocket
            user_id: ID użytkownika
            username: Nazwa użytkownika
            channel_id: Domyślny kanał (general)
        """
        self.active_connections[websocket] = {
            "user_id": user_id,
            "username": username,
            "current_channel": channel_id
        }
        self.online_usernames.add(username)

    def disconnect(self, websocket: WebSocket) -> Optional[Dict[str, str]]:
        """
        Usuwa połączenie użytkownika.

        Args:
            websocket: Obiekt WebSocket do usunięcia

        Returns:
            Informacje o użytkowniku który się rozłączył lub None
        """
        if websocket in self.active_connections:
            user_info = self.active_connections[websocket]
            self.online_usernames.discard(user_info["username"])
            del self.active_connections[websocket]
            return user_info
        return None

    def is_username_taken(self, username: str) -> bool:
        """
        Sprawdza czy nazwa użytkownika jest już używana przez kogoś zalogowanego.

        Args:
            username: Nazwa do sprawdzenia

        Returns:
            True jeśli nazwa jest zajęta, False w przeciwnym razie
        """
        return username in self.online_usernames

    def get_user_info(self, websocket: WebSocket) -> Optional[Dict[str, str]]:
        """
        Zwraca informacje o użytkowniku dla danego połączenia.

        Args:
            websocket: Obiekt WebSocket

        Returns:
            Słownik z informacjami lub None
        """
        return self.active_connections.get(websocket)

    def get_online_users(self) -> List[Dict[str, str]]:
        """
        Zwraca listę wszystkich zalogowanych użytkowników.

        Returns:
            Lista słowników z id i name użytkowników
        """
        users = []
        for user_info in self.active_connections.values():
            users.append({
                "id": user_info["user_id"],
                "name": user_info["username"]
            })
        return users

    async def broadcast_to_channel(self, message: dict, channel_id: str, exclude_ws: Optional[WebSocket] = None):
        """
        Wysyła wiadomość do wszystkich użytkowników na danym kanale.

        Args:
            message: Słownik z wiadomością do wysłania
            channel_id: ID kanału
            exclude_ws: Opcjonalnie wyklucz jedno połączenie (np. nadawcę)
        """
        message_json = json.dumps(message, ensure_ascii=False)

        for websocket, user_info in self.active_connections.items():
            if websocket != exclude_ws and user_info["current_channel"] == channel_id:
                # Wysyłamy tylko do użytkowników którzy są na danym kanale
                try:
                    await websocket.send_text(message_json)
                except Exception as e:
                    print(f"Błąd wysyłania do {user_info['username']}: {e}")

    async def broadcast_to_all(self, message: dict, exclude_ws: Optional[WebSocket] = None):
        """
        Wysyła wiadomość do wszystkich połączonych klientów.

        Args:
            message: Słownik z wiadomością do wysłania
            exclude_ws: Opcjonalnie wyklucz jedno połączenie
        """
        message_json = json.dumps(message, ensure_ascii=False)

        for websocket in self.active_connections.keys():
            if websocket != exclude_ws:
                try:
                    await websocket.send_text(message_json)
                except Exception as e:
                    print(f"Błąd wysyłania broadcast: {e}")

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """
        Wysyła wiadomość do konkretnego klienta.

        Args:
            message: Słownik z wiadomością do wysłania
            websocket: Docelowe połączenie WebSocket
        """
        message_json = json.dumps(message, ensure_ascii=False)
        try:
            await websocket.send_text(message_json)
        except Exception as e:
            print(f"Błąd wysyłania wiadomości osobistej: {e}")


# ====== FUNKCJE WALIDACJI ======

def validate_username(username: str) -> tuple[bool, Optional[str]]:
    """
    Waliduje nazwę użytkownika.

    Zasady:
    - 3-20 znaków
    - Tylko litery, cyfry i podkreślniki

    Returns:
        (is_valid, error_message)
    """
    if not username:
        return False, "Username cannot be empty"

    if len(username) < 3 or len(username) > 20:
        return False, "Username must be between 3 and 20 characters"

    if not re.match(r'^[a-zA-Z0-9_]+$', username):
        return False, "Username can only contain letters, numbers, and underscores"

    return True, None


def validate_message_text(text: str) -> tuple[bool, Optional[str]]:
    """
    Waliduje treść wiadomości.

    Zasady:
    - Nie może być pusta
    - Maksymalnie 300 znaków

    Returns:
        (is_valid, error_message)
    """
    if not text or not text.strip():
        return False, "Message cannot be empty"

    if len(text) > 300:
        return False, "Message too long (max 300 characters)"

    return True, None


# ====== FUNKCJE OBSŁUGI ZDARZEŃ ======

async def send_error(websocket: WebSocket, message: str):
    """
    Wysyła wiadomość o błędzie do klienta.

    Args:
        websocket: Połączenie WebSocket
        message: Treść komunikatu o błędzie
    """
    error_msg = {
        "type": "error_message",
        "payload": {
            "message": message
        }
    }
    await websocket.send_text(json.dumps(error_msg, ensure_ascii=False))


async def send_auth_failure(websocket: WebSocket, reason: str):
    """
    Wysyła wiadomość auth_failure do klienta i zamyka połączenie.

    Args:
        websocket: Połączenie WebSocket
        reason: Przyczyna odrzucenia autentykacji
    """
    auth_failure = {
        "type": "auth_failure",
        "payload": {
            "reason": reason
        }
    }
    await websocket.send_text(json.dumps(auth_failure, ensure_ascii=False))
    await websocket.close()


async def handle_auth_request(data: dict, websocket: WebSocket, manager: ConnectionManager, db_conn):
    """
    Obsługuje żądanie autentykacji użytkownika.

    Proces:
    1. Walidacja danych wejściowych (username, password)
    2. Sprawdzenie duplikatów (czy nick nie jest już używany)
    3. Weryfikacja w bazie danych
    4. Rejestracja w ConnectionManager
    5. Wysłanie auth_success z pełnymi danymi inicjalizacyjnymi
    6. Rozgłoszenie user_joined i user_list_update do innych

    Args:
        data: Dane żądania (type, payload)
        websocket: Połączenie WebSocket
        manager: Menedżer połączeń
        db_conn: Połączenie z bazą danych

    Returns:
        True jeśli autentykacja powiodła się, False w przeciwnym razie
    """
    try:
        payload = data.get("payload", {})
        username = payload.get("username", "").strip()
        password = payload.get("password", "")

        # Walidacja username
        is_valid, error_msg = validate_username(username)
        if not is_valid:
            await send_auth_failure(websocket, error_msg)
            return False

        # Walidacja hasła
        if not password:
            await send_auth_failure(websocket, "Password is required")
            return False

        # Sprawdzenie czy nick nie jest już używany
        if manager.is_username_taken(username):
            await send_auth_failure(websocket, "Nickname already in use.")
            return False

        # Sprawdzenie w bazie danych
        user = get_user_by_username(db_conn, username)

        if not user:
            await send_auth_failure(websocket, "User not found.")
            return False

        # Weryfikacja hasła (na razie proste porównanie - w produkcji użyj bcrypt!)
        if user.password_hash != password:
            await send_auth_failure(websocket, "Invalid password.")
            return False

        # Autentykacja pomyślna - rejestracja w ConnectionManager
        manager.connect(websocket, user.id, user.username, "general")

        # Pobieranie danych dla klienta
        channels = get_all_channels(db_conn)
        initial_history = get_messages_for_channel(db_conn, "general", limit=50)
        online_users = manager.get_online_users()

        # Wysłanie auth_success do zalogowanego użytkownika
        auth_success = {
            "type": "auth_success",
            "payload": {
                "user_info": {
                    "id": user.id,
                    "name": user.username
                },
                "channels": channels,
                "online_users": online_users,
                "initial_channel_history": {
                    "channel_id": "general",
                    "messages": initial_history
                }
            }
        }
        await manager.send_personal_message(auth_success, websocket)

        # Rozgłoszenie user_joined do innych
        user_joined_msg = {
            "type": "user_joined",
            "payload": {
                "user": {
                    "id": user.id,
                    "name": user.username
                }
            }
        }
        await manager.broadcast_to_all(user_joined_msg, exclude_ws=websocket)

        # Rozgłoszenie zaktualizowanej listy użytkowników do wszystkich
        user_list_update = {
            "type": "user_list_update",
            "payload": {
                "online_users": online_users
            }
        }
        await manager.broadcast_to_all(user_list_update)

        print(f"✓ Użytkownik {username} zalogowany pomyślnie")
        return True

    except Exception as e:
        print(f"Błąd podczas autentykacji: {e}")
        await send_error(websocket, "Authentication error")
        await websocket.close()
        return False


async def handle_send_message(data: dict, websocket: WebSocket, manager: ConnectionManager, db_conn):
    """
    Obsługuje wysłanie nowej wiadomości.

    Proces:
    1. Pobiera informacje o użytkowniku
    2. Waliduje dane (channel_id, text)
    3. Zapisuje wiadomość w bazie
    4. Rozgłasza new_message do wszystkich na kanale

    Args:
        data: Dane żądania
        websocket: Połączenie WebSocket
        manager: Menedżer połączeń
        db_conn: Połączenie z bazą danych
    """
    try:
        # Pobierz info o użytkowniku
        user_info = manager.get_user_info(websocket)
        if not user_info:
            await send_error(websocket, "User not authenticated")
            return

        payload = data.get("payload", {})
        channel_id = payload.get("channel_id", "").strip()
        text = payload.get("text", "")

        # Walidacja channel_id
        if not channel_id:
            await send_error(websocket, "Channel ID is required")
            return

        # Walidacja tekstu wiadomości
        is_valid, error_msg = validate_message_text(text)
        if not is_valid:
            await send_error(websocket, error_msg)
            return

        # Zapisz wiadomość w bazie - zwraca tuple (message_id, timestamp)
        message_id, timestamp = add_message(db_conn, channel_id, user_info["user_id"], text)

        # Rozgłoś new_message do wszystkich
        new_message = {
            "type": "new_message",
            "payload": {
                "channel_id": channel_id,
                "message": {
                    "id": message_id,
                    "user": {
                        "id": user_info["user_id"],
                        "name": user_info["username"]
                    },
                    "text": text,
                    "timestamp": timestamp
                }
            }
        }

        await manager.broadcast_to_channel(new_message, channel_id)

        print(f"✓ Wiadomość od {user_info['username']} w kanale {channel_id}: {text[:50]}")

    except Exception as e:
        print(f"Błąd podczas wysyłania wiadomości: {e}")
        await send_error(websocket, "Error sending message")


async def handle_request_history(data: dict, websocket: WebSocket, db_conn):
    """
    Obsługuje żądanie historii wiadomości dla kanału.

    Args:
        data: Dane żądania
        websocket: Połączenie WebSocket
        db_conn: Połączenie z bazą danych
    """
    try:
        payload = data.get("payload", {})
        channel_id = payload.get("channel_id", "").strip()

        if not channel_id:
            await send_error(websocket, "Channel ID is required")
            return

        # Pobierz historię z bazy
        messages = get_messages_for_channel(db_conn, channel_id, limit=50)

        # Wyślij odpowiedź
        history_response = {
            "type": "chat_history",
            "payload": {
                "channel_id": channel_id,
                "messages": messages
            }
        }

        await websocket.send_text(json.dumps(history_response, ensure_ascii=False))

        print(f"✓ Historia kanału {channel_id} wysłana ({len(messages)} wiadomości)")

    except Exception as e:
        print(f"Błąd podczas pobierania historii: {e}")
        await send_error(websocket, "Error fetching history")
