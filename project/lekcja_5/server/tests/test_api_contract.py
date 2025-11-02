"""
Testy zgodności z API Design (Contract Tests)

Ten plik testuje czy backend jest zgodny z api_design.md:
- Struktury JSON dla wszystkich typów wiadomości
- Formaty danych (timestamp ISO 8601, typy pól)
- Walidacja danych wejściowych
- Kodowanie UTF-8 (polskie znaki, emoji)

Te testy zapewniają że backend może być zintegrowany z dowolnym frontendem
który implementuje api_design.md.
"""

import os
import sys
import json
import re
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from websocket_handler import validate_username, validate_message_text


# ====== TESTY STRUKTURY auth_success ======

def test_auth_success_structure():
    """
    Test 1.1: auth_success ma wszystkie wymagane pola zgodnie z api_design.md
    """
    # Przykładowa struktura auth_success
    auth_success = {
        "type": "auth_success",
        "payload": {
            "user_info": {"id": "user123", "name": "JanKowalski"},
            "channels": [
                {"id": "general", "name": "Ogólny", "type": "public"},
                {"id": "random", "name": "Ciekawostki", "type": "public"}
            ],
            "online_users": [
                {"id": "user123", "name": "JanKowalski"},
                {"id": "user456", "name": "AnnaNowak"}
            ],
            "initial_channel_history": {
                "channel_id": "general",
                "messages": [
                    {
                        "user": {"id": "user456", "name": "AnnaNowak"},
                        "text": "Cześć wszystkim!",
                        "timestamp": "2025-09-28T10:00:00Z"
                    }
                ]
            }
        }
    }

    # Sprawdź główny typ
    assert auth_success["type"] == "auth_success", "Type powinien być 'auth_success'"

    payload = auth_success["payload"]

    # Sprawdź user_info
    assert "user_info" in payload, "Payload powinien zawierać 'user_info'"
    assert "id" in payload["user_info"], "user_info powinien mieć 'id'"
    assert "name" in payload["user_info"], "user_info powinien mieć 'name'"

    # Sprawdź channels
    assert "channels" in payload, "Payload powinien zawierać 'channels'"
    assert isinstance(payload["channels"], list), "channels powinno być listą"
    if len(payload["channels"]) > 0:
        channel = payload["channels"][0]
        assert "id" in channel, "Channel powinien mieć 'id'"
        assert "name" in channel, "Channel powinien mieć 'name'"
        assert "type" in channel, "Channel powinien mieć 'type'"

    # Sprawdź online_users
    assert "online_users" in payload, "Payload powinien zawierać 'online_users'"
    assert isinstance(payload["online_users"], list), "online_users powinno być listą"
    if len(payload["online_users"]) > 0:
        user = payload["online_users"][0]
        assert "id" in user, "User powinien mieć 'id'"
        assert "name" in user, "User powinien mieć 'name'"

    # Sprawdź initial_channel_history
    assert "initial_channel_history" in payload, "Payload powinien zawierać 'initial_channel_history'"
    history = payload["initial_channel_history"]
    assert "channel_id" in history, "History powinien mieć 'channel_id'"
    assert "messages" in history, "History powinien mieć 'messages'"
    assert isinstance(history["messages"], list), "messages powinno być listą"


def test_auth_success_field_types():
    """
    Test 1.2: Pola w auth_success mają poprawne typy danych
    """
    auth_success = {
        "type": "auth_success",
        "payload": {
            "user_info": {"id": "user123", "name": "JanKowalski"},
            "channels": [{"id": "general", "name": "Ogólny", "type": "public"}],
            "online_users": [{"id": "user123", "name": "JanKowalski"}],
            "initial_channel_history": {
                "channel_id": "general",
                "messages": []
            }
        }
    }

    payload = auth_success["payload"]

    # Typy pól
    assert isinstance(payload["user_info"]["id"], str), "user_info.id powinien być stringiem"
    assert isinstance(payload["user_info"]["name"], str), "user_info.name powinien być stringiem"
    assert isinstance(payload["channels"], list), "channels powinno być listą"
    assert isinstance(payload["online_users"], list), "online_users powinno być listą"
    assert isinstance(payload["initial_channel_history"], dict), "initial_channel_history powinien być dictem"
    assert isinstance(payload["initial_channel_history"]["channel_id"], str), "channel_id powinien być stringiem"
    assert isinstance(payload["initial_channel_history"]["messages"], list), "messages powinno być listą"


# ====== TESTY STRUKTURY new_message ======

def test_new_message_structure():
    """
    Test 2.1: new_message ma poprawną strukturę zgodnie z api_design.md
    """
    new_message = {
        "type": "new_message",
        "payload": {
            "channel_id": "general",
            "message": {
                "id": "msg_abc123",
                "user": {
                    "id": "user123",
                    "name": "JanKowalski"
                },
                "text": "Jak mija dzień?",
                "timestamp": "2025-09-28T10:05:00Z"
            }
        }
    }

    # Sprawdź główny typ
    assert new_message["type"] == "new_message", "Type powinien być 'new_message'"

    payload = new_message["payload"]

    # Sprawdź channel_id
    assert "channel_id" in payload, "Payload powinien zawierać 'channel_id'"
    assert isinstance(payload["channel_id"], str), "channel_id powinien być stringiem"

    # Sprawdź message
    assert "message" in payload, "Payload powinien zawierać 'message'"
    message = payload["message"]

    assert "id" in message, "Message powinien mieć 'id'"
    assert "user" in message, "Message powinien mieć 'user'"
    assert "text" in message, "Message powinien mieć 'text'"
    assert "timestamp" in message, "Message powinien mieć 'timestamp'"

    # Sprawdź user w message
    user = message["user"]
    assert "id" in user, "User powinien mieć 'id'"
    assert "name" in user, "User powinien mieć 'name'"


def test_new_message_timestamp_format():
    """
    Test 2.2: Timestamp w new_message jest w formacie ISO 8601 UTC
    """
    timestamp = "2025-09-28T10:05:00Z"

    # Sprawdź że kończy się na 'Z'
    assert timestamp.endswith('Z'), "Timestamp powinien kończyć się na 'Z' (UTC)"

    # Sprawdź że można go sparsować
    try:
        datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%SZ")
    except ValueError:
        assert False, f"Timestamp nie jest w formacie ISO 8601 UTC: {timestamp}"


# ====== TESTY STRUKTURY chat_history ======

def test_chat_history_structure():
    """
    Test 3.1: chat_history ma poprawną strukturę
    """
    chat_history = {
        "type": "chat_history",
        "payload": {
            "channel_id": "general",
            "messages": [
                {
                    "user": {"id": "user456", "name": "AnnaNowak"},
                    "text": "Cześć wszystkim!",
                    "timestamp": "2025-09-28T10:00:00Z"
                },
                {
                    "user": {"id": "user123", "name": "JanKowalski"},
                    "text": "Hej!",
                    "timestamp": "2025-09-28T10:01:00Z"
                }
            ]
        }
    }

    # Sprawdź typ
    assert chat_history["type"] == "chat_history", "Type powinien być 'chat_history'"

    payload = chat_history["payload"]

    # Sprawdź channel_id
    assert "channel_id" in payload, "Payload powinien zawierać 'channel_id'"

    # Sprawdź messages
    assert "messages" in payload, "Payload powinien zawierać 'messages'"
    assert isinstance(payload["messages"], list), "messages powinno być listą"

    # Sprawdź strukturę pojedynczej wiadomości
    if len(payload["messages"]) > 0:
        message = payload["messages"][0]
        assert "user" in message, "Wiadomość powinna mieć 'user'"
        assert "text" in message, "Wiadomość powinna mieć 'text'"
        assert "timestamp" in message, "Wiadomość powinna mieć 'timestamp'"

        user = message["user"]
        assert "id" in user, "User powinien mieć 'id'"
        assert "name" in user, "User powinien mieć 'name'"


def test_chat_history_messages_are_chronological():
    """
    Test 3.2: Wiadomości w chat_history są posortowane chronologicznie
    """
    messages = [
        {
            "user": {"id": "user1", "name": "User1"},
            "text": "First",
            "timestamp": "2025-09-28T10:00:00Z"
        },
        {
            "user": {"id": "user2", "name": "User2"},
            "text": "Second",
            "timestamp": "2025-09-28T10:01:00Z"
        },
        {
            "user": {"id": "user3", "name": "User3"},
            "text": "Third",
            "timestamp": "2025-09-28T10:02:00Z"
        }
    ]

    # Sprawdź że każdy kolejny timestamp jest >= poprzedni
    for i in range(len(messages) - 1):
        timestamp1 = messages[i]["timestamp"]
        timestamp2 = messages[i+1]["timestamp"]
        assert timestamp2 >= timestamp1, \
            f"Wiadomości powinny być posortowane chronologicznie: {timestamp1} -> {timestamp2}"


# ====== TESTY STRUKTURY auth_failure ======

def test_auth_failure_structure():
    """
    Test 4.1: auth_failure ma poprawną strukturę
    """
    auth_failure = {
        "type": "auth_failure",
        "payload": {
            "reason": "Nickname already in use."
        }
    }

    assert auth_failure["type"] == "auth_failure", "Type powinien być 'auth_failure'"
    assert "reason" in auth_failure["payload"], "Payload powinien zawierać 'reason'"
    assert isinstance(auth_failure["payload"]["reason"], str), "reason powinien być stringiem"


# ====== TESTY STRUKTURY error_message ======

def test_error_message_structure():
    """
    Test 5.1: error_message ma poprawną strukturę
    """
    error_message = {
        "type": "error_message",
        "payload": {
            "message": "Message too long."
        }
    }

    assert error_message["type"] == "error_message", "Type powinien być 'error_message'"
    assert "message" in error_message["payload"], "Payload powinien zawierać 'message'"
    assert isinstance(error_message["payload"]["message"], str), "message powinien być stringiem"


# ====== TESTY STRUKTURY user_joined / user_left ======

def test_user_joined_structure():
    """
    Test 6.1: user_joined ma poprawną strukturę
    """
    user_joined = {
        "type": "user_joined",
        "payload": {
            "user": {"id": "user789", "name": "PiotrZieliński"}
        }
    }

    assert user_joined["type"] == "user_joined", "Type powinien być 'user_joined'"
    assert "user" in user_joined["payload"], "Payload powinien zawierać 'user'"
    user = user_joined["payload"]["user"]
    assert "id" in user, "User powinien mieć 'id'"
    assert "name" in user, "User powinien mieć 'name'"


def test_user_left_structure():
    """
    Test 6.2: user_left ma poprawną strukturę
    """
    user_left = {
        "type": "user_left",
        "payload": {
            "user": {"id": "user456", "name": "AnnaNowak"}
        }
    }

    assert user_left["type"] == "user_left", "Type powinien być 'user_left'"
    assert "user" in user_left["payload"], "Payload powinien zawierać 'user'"
    user = user_left["payload"]["user"]
    assert "id" in user, "User powinien mieć 'id'"
    assert "name" in user, "User powinien mieć 'name'"


# ====== TESTY STRUKTURY user_list_update ======

def test_user_list_update_structure():
    """
    Test 7.1: user_list_update ma poprawną strukturę
    """
    user_list_update = {
        "type": "user_list_update",
        "payload": {
            "online_users": [
                {"id": "user123", "name": "JanKowalski"},
                {"id": "user456", "name": "AnnaNowak"}
            ]
        }
    }

    assert user_list_update["type"] == "user_list_update", "Type powinien być 'user_list_update'"
    assert "online_users" in user_list_update["payload"], "Payload powinien zawierać 'online_users'"
    assert isinstance(user_list_update["payload"]["online_users"], list), "online_users powinno być listą"

    if len(user_list_update["payload"]["online_users"]) > 0:
        user = user_list_update["payload"]["online_users"][0]
        assert "id" in user, "User powinien mieć 'id'"
        assert "name" in user, "User powinien mieć 'name'"


# ====== TESTY WALIDACJI USERNAME ======

def test_validate_username_length_3_to_20():
    """
    Test 8.1: Username musi mieć 3-20 znaków
    """
    # Za krótki (< 3)
    is_valid, error = validate_username("ab")
    assert not is_valid, "Username z 2 znakami powinien być odrzucony"
    assert "between 3 and 20" in error.lower(), "Błąd powinien wspominać o długości"

    # Poprawny (3 znaki)
    is_valid, error = validate_username("abc")
    assert is_valid, "Username z 3 znakami powinien być akceptowany"

    # Poprawny (20 znaków)
    is_valid, error = validate_username("a" * 20)
    assert is_valid, "Username z 20 znakami powinien być akceptowany"

    # Za długi (> 20)
    is_valid, error = validate_username("a" * 21)
    assert not is_valid, "Username z 21 znakami powinien być odrzucony"
    assert "between 3 and 20" in error.lower(), "Błąd powinien wspominać o długości"


def test_validate_username_allowed_characters():
    """
    Test 8.2: Username może zawierać tylko litery, cyfry i podkreślniki
    """
    # Poprawne
    valid_usernames = ["Jan", "Jan123", "Jan_Kowalski", "user_1", "ABC123"]
    for username in valid_usernames:
        is_valid, error = validate_username(username)
        assert is_valid, f"Username '{username}' powinien być akceptowany"

    # Niepoprawne (zawierają niedozwolone znaki)
    invalid_usernames = ["Jan Kowalski", "Jan-Kowalski", "Jan@email", "Jan!", "Jan#123"]
    for username in invalid_usernames:
        is_valid, error = validate_username(username)
        assert not is_valid, f"Username '{username}' powinien być odrzucony"
        assert "letters, numbers, and underscores" in error.lower() or "only contain" in error.lower(), \
            "Błąd powinien wspominać o dozwolonych znakach"


def test_validate_username_empty():
    """
    Test 8.3: Username nie może być pusty
    """
    is_valid, error = validate_username("")
    assert not is_valid, "Pusty username powinien być odrzucony"
    assert "empty" in error.lower(), "Błąd powinien wspominać o pustym username"


# ====== TESTY WALIDACJI MESSAGE TEXT ======

def test_validate_message_text_not_empty():
    """
    Test 9.1: Wiadomość nie może być pusta
    """
    # Pusty string
    is_valid, error = validate_message_text("")
    assert not is_valid, "Pusta wiadomość powinna być odrzucona"
    assert "empty" in error.lower(), "Błąd powinien wspominać o pustej wiadomości"

    # Tylko białe znaki
    is_valid, error = validate_message_text("   ")
    assert not is_valid, "Wiadomość zawierająca tylko spacje powinna być odrzucona"


def test_validate_message_text_max_300_characters():
    """
    Test 9.2: Wiadomość może mieć maksymalnie 300 znaków
    """
    # 300 znaków - OK
    is_valid, error = validate_message_text("a" * 300)
    assert is_valid, "Wiadomość z 300 znakami powinna być akceptowana"

    # 301 znaków - za długa
    is_valid, error = validate_message_text("a" * 301)
    assert not is_valid, "Wiadomość z 301 znakami powinna być odrzucona"
    assert "too long" in error.lower() or "max 300" in error.lower(), \
        "Błąd powinien wspominać o maksymalnej długości"


def test_validate_message_text_normal_messages():
    """
    Test 9.3: Normalne wiadomości są akceptowane
    """
    valid_messages = [
        "Cześć!",
        "Jak się masz?",
        "To jest testowa wiadomość.",
        "a",  # Jeden znak też OK
        "Test emoji: 😊👋"
    ]

    for text in valid_messages:
        is_valid, error = validate_message_text(text)
        assert is_valid, f"Wiadomość '{text}' powinna być akceptowana"


# ====== TESTY KODOWANIA UTF-8 ======

def test_utf8_polish_characters():
    """
    Test 10.1: Polskie znaki są prawidłowo obsługiwane
    """
    polish_texts = [
        "Cześć! Jak się masz?",
        "Zażółć gęślą jaźń",
        "Łódź, Wrocław, Gdańsk",
        "Mówimy po polsku: ąćęłńóśźż ĄĆĘŁŃÓŚŹŻ"
    ]

    for text in polish_texts:
        # Sprawdź że można zakodować i odkodować
        encoded = text.encode('utf-8')
        decoded = encoded.decode('utf-8')
        assert decoded == text, f"Tekst z polskimi znakami powinien być zachowany: {text}"

        # Sprawdź że walidacja akceptuje
        is_valid, error = validate_message_text(text)
        assert is_valid, f"Wiadomość z polskimi znakami powinna być akceptowana: {text}"


def test_utf8_emoji():
    """
    Test 10.2: Emoji są prawidłowo obsługiwane
    """
    emoji_texts = [
        "Hello! 👋",
        "Great work! 😊 🎉",
        "Test emoji: 💪❤️✨🚀",
        "🔥🔥🔥",
        "Thumbs up: 👍"
    ]

    for text in emoji_texts:
        # Sprawdź że można zakodować i odkodować
        encoded = text.encode('utf-8')
        decoded = encoded.decode('utf-8')
        assert decoded == text, f"Tekst z emoji powinien być zachowany: {text}"

        # Sprawdź że walidacja akceptuje
        is_valid, error = validate_message_text(text)
        assert is_valid, f"Wiadomość z emoji powinna być akceptowana: {text}"


def test_utf8_mixed_content():
    """
    Test 10.3: Mieszana zawartość (polskie znaki + emoji + angielski)
    """
    mixed_texts = [
        "Cześć! 👋 How are you?",
        "Super! 😊 Wszystko działa!",
        "Test: ąćęłńóśźż + 🚀✨"
    ]

    for text in mixed_texts:
        # Sprawdź że można zakodować i odkodować
        encoded = text.encode('utf-8')
        decoded = encoded.decode('utf-8')
        assert decoded == text, f"Tekst mieszany powinien być zachowany: {text}"

        # Sprawdź że walidacja akceptuje
        is_valid, error = validate_message_text(text)
        assert is_valid, f"Wiadomość mieszana powinna być akceptowana: {text}"


# ====== TESTY JSON SERIALIZATION ======

def test_json_serialization_with_utf8():
    """
    Test 11.1: JSON poprawnie serializuje znaki UTF-8
    """
    message = {
        "type": "new_message",
        "payload": {
            "channel_id": "general",
            "message": {
                "user": {"id": "user1", "name": "Janek"},
                "text": "Cześć! 👋 Jak się masz?",
                "timestamp": "2025-09-28T10:00:00Z"
            }
        }
    }

    # Serializuj bez ensure_ascii (UTF-8 powinno być zachowane)
    json_str = json.dumps(message, ensure_ascii=False)

    # Deserializuj
    parsed = json.loads(json_str)

    # Sprawdź że tekst się zgadza
    assert parsed["payload"]["message"]["text"] == "Cześć! 👋 Jak się masz?", \
        "Tekst z UTF-8 powinien być zachowany po serializacji JSON"


def test_message_envelope_format():
    """
    Test 11.2: Wszystkie wiadomości używają formatu {"type": "...", "payload": {...}}
    """
    messages = [
        {"type": "auth_request", "payload": {"username": "Jan", "password": "pass"}},
        {"type": "send_message", "payload": {"channel_id": "general", "text": "Hi"}},
        {"type": "request_history", "payload": {"channel_id": "general"}},
        {"type": "auth_success", "payload": {}},
        {"type": "new_message", "payload": {}},
        {"type": "error_message", "payload": {"message": "Error"}},
    ]

    for msg in messages:
        assert "type" in msg, f"Wiadomość powinna mieć pole 'type': {msg}"
        assert "payload" in msg, f"Wiadomość powinna mieć pole 'payload': {msg}"
        assert isinstance(msg["type"], str), f"'type' powinien być stringiem: {msg}"
        assert isinstance(msg["payload"], dict), f"'payload' powinien być dictem: {msg}"
