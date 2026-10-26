"""
Testy jednostkowe dla modułu database.py

Ten plik testuje:
- Inicjalizację bazy danych
- Ładowanie przykładowych danych
- Funkcje CRUD (get_user_by_username, get_messages_for_channel, add_message)
- Izolację testów (każdy test używa tymczasowej bazy)
"""

import os
import sqlite3
import tempfile
import pytest
from datetime import datetime, timezone

# Import funkcji z modułu database
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import (
    init_database,
    create_tables,
    seed_sample_data,
    get_user_by_username,
    get_channel_by_id,
    get_all_channels,
    get_messages_for_channel,
    add_message,
    get_timestamp
)


# ====== FIXTURES ======

@pytest.fixture
def temp_db():
    """
    Tworzy tymczasową bazę danych dla każdego testu.

    Po zakończeniu testu automatycznie usuwa plik bazy.
    Zapewnia pełną izolację testów.
    """
    # Utwórz tymczasowy plik
    fd, db_path = tempfile.mkstemp(suffix='.db')
    os.close(fd)

    # Zapisz oryginalną ścieżkę bazy
    original_cwd = os.getcwd()

    # Zmień katalog roboczy na katalog z testami
    test_dir = tempfile.mkdtemp()
    os.chdir(test_dir)

    # Utwórz połączenie z tymczasową bazą
    conn = sqlite3.connect('chat.db', check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA encoding = 'UTF-8'")

    # Utwórz strukturę tabel
    create_tables(conn)

    yield conn

    # Cleanup: zamknij połączenie i usuń pliki
    conn.close()
    os.chdir(original_cwd)

    # Usuń tymczasowe pliki
    try:
        os.remove(os.path.join(test_dir, 'chat.db'))
        os.rmdir(test_dir)
    except:
        pass


@pytest.fixture
def temp_db_with_data():
    """
    Tworzy tymczasową bazę danych z przykładowymi danymi.

    Używana do testów które wymagają istniejących danych.
    """
    # Utwórz tymczasowy plik
    test_dir = tempfile.mkdtemp()
    original_cwd = os.getcwd()
    os.chdir(test_dir)

    # Utwórz połączenie
    conn = sqlite3.connect('chat.db', check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA encoding = 'UTF-8'")

    # Utwórz tabele i załaduj dane
    create_tables(conn)
    seed_sample_data(conn)

    yield conn

    # Cleanup
    conn.close()
    os.chdir(original_cwd)
    try:
        os.remove(os.path.join(test_dir, 'chat.db'))
        os.rmdir(test_dir)
    except:
        pass


# ====== TESTY INICJALIZACJI ======

def test_init_database_creates_file():
    """
    Test 1.1: init_database() tworzy plik chat.db
    """
    test_dir = tempfile.mkdtemp()
    original_cwd = os.getcwd()
    os.chdir(test_dir)

    try:
        # Sprawdź że plik nie istnieje
        assert not os.path.exists('chat.db')

        # Wywołaj init_database
        conn = init_database()

        # Sprawdź że plik został utworzony
        assert os.path.exists('chat.db')

        # Sprawdź że można wykonać zapytanie
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]

        # Powinny istnieć wszystkie tabele
        assert 'users' in tables
        assert 'channels' in tables
        assert 'messages' in tables
        assert 'channel_members' in tables

        conn.close()

    finally:
        os.chdir(original_cwd)
        try:
            os.remove(os.path.join(test_dir, 'chat.db'))
            os.rmdir(test_dir)
        except:
            pass


def test_init_database_loads_sample_data_on_first_run():
    """
    Test 1.2: init_database() ładuje przykładowe dane przy pierwszym uruchomieniu
    """
    test_dir = tempfile.mkdtemp()
    original_cwd = os.getcwd()
    os.chdir(test_dir)

    try:
        # Pierwsze uruchomienie
        conn = init_database()

        # Sprawdź czy dane zostały załadowane
        cursor = conn.cursor()

        # Sprawdź użytkowników (powinno być 3: Jan, Anna, Piotr)
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        assert user_count == 3, "Powinno być 3 użytkowników"

        # Sprawdź kanały (powinny być 2: general, random)
        cursor.execute("SELECT COUNT(*) FROM channels")
        channel_count = cursor.fetchone()[0]
        assert channel_count == 2, "Powinny być 2 kanały"

        # Sprawdź wiadomości (powinno być 7 w general)
        cursor.execute("SELECT COUNT(*) FROM messages")
        message_count = cursor.fetchone()[0]
        assert message_count == 7, "Powinno być 7 wiadomości"

        conn.close()

    finally:
        os.chdir(original_cwd)
        try:
            os.remove(os.path.join(test_dir, 'chat.db'))
            os.rmdir(test_dir)
        except:
            pass


def test_init_database_does_not_duplicate_data_on_second_run():
    """
    Test 1.3: init_database() NIE duplikuje danych przy drugim uruchomieniu
    """
    test_dir = tempfile.mkdtemp()
    original_cwd = os.getcwd()
    os.chdir(test_dir)

    try:
        # Pierwsze uruchomienie
        conn1 = init_database()
        cursor = conn1.cursor()
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count_first = cursor.fetchone()[0]
        conn1.close()

        # Drugie uruchomienie (baza już istnieje)
        conn2 = init_database()
        cursor = conn2.cursor()
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count_second = cursor.fetchone()[0]

        # Liczba użytkowników powinna być taka sama
        assert user_count_first == user_count_second, \
            "Dane nie powinny być duplikowane przy drugim uruchomieniu"

        conn2.close()

    finally:
        os.chdir(original_cwd)
        try:
            os.remove(os.path.join(test_dir, 'chat.db'))
            os.rmdir(test_dir)
        except:
            pass


# ====== TESTY get_user_by_username ======

def test_get_user_by_username_finds_existing_user(temp_db_with_data):
    """
    Test 2.1: get_user_by_username() znajduje istniejącego użytkownika
    """
    conn = temp_db_with_data

    # Szukaj użytkownika Jan (istnieje w przykładowych danych)
    user = get_user_by_username(conn, "Jan")

    # Sprawdź że użytkownik został znaleziony
    assert user is not None, "Użytkownik Jan powinien zostać znaleziony"
    assert user.username == "Jan"
    assert user.id == "user_1"
    assert user.password_hash == "ircAMP2024!"


def test_get_user_by_username_returns_none_for_nonexistent(temp_db_with_data):
    """
    Test 2.2: get_user_by_username() zwraca None dla nieistniejącego użytkownika
    """
    conn = temp_db_with_data

    # Szukaj nieistniejącego użytkownika
    user = get_user_by_username(conn, "NieistniejacyUser")

    # Sprawdź że zwrócono None
    assert user is None, "Dla nieistniejącego użytkownika powinno zwrócić None"


def test_get_user_by_username_is_case_sensitive(temp_db_with_data):
    """
    Test 2.3: get_user_by_username() rozróżnia wielkość liter
    """
    conn = temp_db_with_data

    # Username z przykładowych danych to "Jan", nie "jan"
    user_correct = get_user_by_username(conn, "Jan")
    user_lowercase = get_user_by_username(conn, "jan")

    assert user_correct is not None, "Jan (z dużej litery) powinien zostać znaleziony"
    assert user_lowercase is None, "jan (z małej litery) nie powinien zostać znaleziony"


# ====== TESTY get_messages_for_channel ======

def test_get_messages_for_channel_returns_chronological_order(temp_db_with_data):
    """
    Test 3.1: get_messages_for_channel() zwraca wiadomości w chronologicznej kolejności
    """
    conn = temp_db_with_data

    # Pobierz wiadomości z kanału general
    messages = get_messages_for_channel(conn, "general", limit=50)

    # Sprawdź że są wiadomości
    assert len(messages) > 0, "Kanał general powinien mieć wiadomości"

    # Sprawdź kolejność chronologiczną (od najstarszej do najnowszej)
    # Porównujemy timestampy kolejnych wiadomości
    for i in range(len(messages) - 1):
        timestamp1 = messages[i]['timestamp']
        timestamp2 = messages[i+1]['timestamp']

        # timestamp2 powinien być >= timestamp1 (lub równy, jeśli te same sekundy)
        assert timestamp2 >= timestamp1, \
            f"Wiadomości powinny być posortowane chronologicznie: {timestamp1} -> {timestamp2}"


def test_get_messages_for_channel_respects_limit(temp_db):
    """
    Test 3.2: get_messages_for_channel() respektuje parametr limit
    """
    conn = temp_db

    # Dodaj więcej wiadomości niż limit
    seed_sample_data(conn)

    # Pobierz z limitem 3
    messages = get_messages_for_channel(conn, "general", limit=3)

    # Sprawdź że zwrócono dokładnie 3 wiadomości
    assert len(messages) == 3, f"Powinno zwrócić 3 wiadomości, zwrócono {len(messages)}"


def test_get_messages_for_channel_returns_empty_for_nonexistent_channel(temp_db_with_data):
    """
    Test 3.3: get_messages_for_channel() zwraca pustą listę dla nieistniejącego kanału
    """
    conn = temp_db_with_data

    messages = get_messages_for_channel(conn, "nonexistent_channel", limit=50)

    assert len(messages) == 0, "Dla nieistniejącego kanału powinna być pusta lista"


def test_get_messages_for_channel_includes_user_info(temp_db_with_data):
    """
    Test 3.4: get_messages_for_channel() zawiera informacje o użytkowniku
    """
    conn = temp_db_with_data

    messages = get_messages_for_channel(conn, "general", limit=1)

    assert len(messages) > 0, "Powinno być przynajmniej 1 wiadomość"

    message = messages[0]

    # Sprawdź strukturę zgodnie z api_design.md
    assert 'user' in message, "Wiadomość powinna zawierać pole 'user'"
    assert 'id' in message['user'], "User powinien mieć pole 'id'"
    assert 'name' in message['user'], "User powinien mieć pole 'name'"
    assert 'text' in message, "Wiadomość powinna zawierać pole 'text'"
    assert 'timestamp' in message, "Wiadomość powinna zawierać pole 'timestamp'"


# ====== TESTY add_message ======

def test_add_message_adds_to_database(temp_db_with_data):
    """
    Test 4.1: add_message() dodaje wiadomość do bazy danych
    """
    conn = temp_db_with_data

    # Policz wiadomości przed dodaniem
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM messages WHERE channel_id = ?", ("general",))
    count_before = cursor.fetchone()[0]

    # Dodaj nową wiadomość
    message_id, timestamp = add_message(conn, "general", "user_1", "Test message")

    # Policz wiadomości po dodaniu
    cursor.execute("SELECT COUNT(*) FROM messages WHERE channel_id = ?", ("general",))
    count_after = cursor.fetchone()[0]

    # Sprawdź że liczba wzrosła o 1
    assert count_after == count_before + 1, "Liczba wiadomości powinna wzrosnąć o 1"

    # Sprawdź że wiadomość istnieje w bazie
    cursor.execute("SELECT * FROM messages WHERE id = ?", (message_id,))
    row = cursor.fetchone()

    assert row is not None, "Wiadomość powinna zostać dodana do bazy"
    assert row['text'] == "Test message"
    assert row['user_id'] == "user_1"
    assert row['channel_id'] == "general"


def test_add_message_generates_valid_timestamp(temp_db_with_data):
    """
    Test 4.2: add_message() generuje poprawny timestamp w formacie ISO 8601 UTC
    """
    conn = temp_db_with_data

    # Dodaj wiadomość
    message_id, timestamp = add_message(conn, "general", "user_1", "Test timestamp")

    # Sprawdź format timestamp
    assert timestamp is not None, "Timestamp nie powinien być None"
    assert isinstance(timestamp, str), "Timestamp powinien być stringiem"

    # Sprawdź że timestamp kończy się na 'Z' (UTC)
    assert timestamp.endswith('Z'), "Timestamp powinien kończyć się na 'Z' (UTC)"

    # Sprawdź że można go sparsować
    try:
        # Format: "2025-09-28T10:01:00Z"
        datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%SZ")
    except ValueError:
        pytest.fail(f"Timestamp nie jest w formacie ISO 8601 UTC: {timestamp}")


def test_add_message_returns_unique_id(temp_db_with_data):
    """
    Test 4.3: add_message() zwraca unikalny ID dla każdej wiadomości
    """
    conn = temp_db_with_data

    # Dodaj kilka wiadomości
    id1, _ = add_message(conn, "general", "user_1", "Message 1")
    id2, _ = add_message(conn, "general", "user_1", "Message 2")
    id3, _ = add_message(conn, "general", "user_1", "Message 3")

    # Sprawdź że ID są różne
    assert id1 != id2, "ID powinny być unikalne"
    assert id2 != id3, "ID powinny być unikalne"
    assert id1 != id3, "ID powinny być unikalne"


def test_add_message_handles_utf8_characters(temp_db_with_data):
    """
    Test 4.4: add_message() poprawnie obsługuje znaki UTF-8 (polskie znaki, emoji)
    """
    conn = temp_db_with_data

    # Dodaj wiadomości z polskimi znakami i emoji
    messages_to_test = [
        "Cześć! Jak się masz?",
        "Zażółć gęślą jaźń",
        "Hello! 👋 😊 🎉",
        "Test emoji: 💪❤️✨"
    ]

    for text in messages_to_test:
        message_id, timestamp = add_message(conn, "general", "user_1", text)

        # Pobierz wiadomość z bazy
        cursor = conn.cursor()
        cursor.execute("SELECT text FROM messages WHERE id = ?", (message_id,))
        row = cursor.fetchone()

        # Sprawdź że tekst się zgadza (z UTF-8)
        assert row['text'] == text, \
            f"Tekst powinien być zachowany z UTF-8: oczekiwano '{text}', otrzymano '{row['text']}'"


# ====== TESTY get_all_channels ======

def test_get_all_channels_returns_all_channels(temp_db_with_data):
    """
    Test 5.1: get_all_channels() zwraca wszystkie kanały
    """
    conn = temp_db_with_data

    channels = get_all_channels(conn)

    # Powinny być 2 kanały: general i random
    assert len(channels) == 2, "Powinny być 2 kanały"

    # Sprawdź że są odpowiednie kanały
    channel_ids = [ch['id'] for ch in channels]
    assert 'general' in channel_ids, "Powinien istnieć kanał general"
    assert 'random' in channel_ids, "Powinien istnieć kanał random"


def test_get_all_channels_returns_correct_structure(temp_db_with_data):
    """
    Test 5.2: get_all_channels() zwraca prawidłową strukturę zgodną z API
    """
    conn = temp_db_with_data

    channels = get_all_channels(conn)

    for channel in channels:
        # Sprawdź wymagane pola zgodnie z api_design.md
        assert 'id' in channel, "Kanał powinien mieć pole 'id'"
        assert 'name' in channel, "Kanał powinien mieć pole 'name'"
        assert 'type' in channel, "Kanał powinien mieć pole 'type'"

        # Sprawdź że type to 'public' lub 'private'
        assert channel['type'] in ['public', 'private'], \
            f"Type powinien być 'public' lub 'private', jest: {channel['type']}"


# ====== TESTY get_timestamp ======

def test_get_timestamp_returns_iso8601_utc_format():
    """
    Test 6.1: get_timestamp() zwraca timestamp w formacie ISO 8601 UTC
    """
    timestamp = get_timestamp()

    # Sprawdź że kończy się na 'Z'
    assert timestamp.endswith('Z'), "Timestamp powinien kończyć się na 'Z' (UTC)"

    # Sprawdź że można go sparsować
    try:
        datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%SZ")
    except ValueError:
        pytest.fail(f"Timestamp nie jest w formacie ISO 8601 UTC: {timestamp}")


def test_get_timestamp_is_current_time():
    """
    Test 6.2: get_timestamp() zwraca aktualny czas (z dokładnością do kilku sekund)
    """
    before = datetime.now(timezone.utc).replace(microsecond=0)
    timestamp_str = get_timestamp()
    after = datetime.now(timezone.utc).replace(microsecond=0)

    # Parsuj timestamp
    timestamp = datetime.strptime(timestamp_str, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)

    # Sprawdź że jest pomiędzy before i after (z tolerancją 1 sekundy)
    assert before <= timestamp <= after or (timestamp - before).total_seconds() <= 1, \
        "Timestamp powinien być z aktualnego czasu"
