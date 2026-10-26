"""
Zarządzanie bazą danych SQLite.

Ten moduł odpowiada za:
- Inicjalizację bazy danych
- Tworzenie tabel
- Ładowanie przykładowych danych (seed data)
- Operacje CRUD (Create, Read, Update, Delete)
"""

import sqlite3
import os
import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from models import User, Channel, Message


def get_timestamp() -> str:
    """
    Zwraca aktualny timestamp w formacie ISO 8601 UTC.

    Format: "2025-09-28T10:01:00Z" (zgodny z api_design.md)
    """
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def init_database() -> sqlite3.Connection:
    """
    Inteligentna inicjalizacja bazy danych.

    Sprawdza czy plik chat.db istnieje:
    - Jeśli NIE: tworzy bazę i ładuje przykładowe dane
    - Jeśli TAK: tylko łączy się z istniejącą bazą

    Returns:
        sqlite3.Connection: Połączenie z bazą danych
    """
    db_exists = os.path.exists('chat.db')

    # Utworzenie połączenia z bazą (jeśli nie istnieje, SQLite ją utworzy)
    conn = sqlite3.connect('chat.db', check_same_thread=False)
    conn.row_factory = sqlite3.Row  # Umożliwia dostęp do kolumn po nazwach

    # Włączenie obsługi kluczy obcych (foreign keys)
    conn.execute("PRAGMA foreign_keys = ON")
    # Ustawienie kodowania UTF-8 dla poprawnej obsługi znaków Unicode
    conn.execute("PRAGMA encoding = 'UTF-8'")

    if not db_exists:
        # Pierwsze uruchomienie - tworzenie struktury i danych
        print("📦 Tworzenie nowej bazy danych...")
        create_tables(conn)
        seed_sample_data(conn)
        print("✓ Baza danych utworzona z przykładowymi danymi")
    else:
        # Kolejne uruchomienie - tylko połączenie
        print("✓ Połączono z istniejącą bazą danych")

    return conn


def create_tables(conn: sqlite3.Connection) -> None:
    """
    Tworzy strukturę tabel w bazie danych.

    Tabele:
    - users: użytkownicy systemu
    - channels: kanały czatu (publiczne i prywatne)
    - messages: wiadomości
    - channel_members: relacja użytkowników do kanałów
    """
    cursor = conn.cursor()

    # Tabela użytkowników
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    # Tabela kanałów
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS channels (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('public', 'private')),
            created_at TEXT NOT NULL
        )
    """)

    # Tabela wiadomości
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            channel_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            text TEXT NOT NULL,
            created_at TEXT NOT NULL,
            edited_at TEXT,
            FOREIGN KEY (channel_id) REFERENCES channels(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    # Tabela członków kanałów (relacja wiele-do-wielu)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS channel_members (
            user_id TEXT NOT NULL,
            channel_id TEXT NOT NULL,
            PRIMARY KEY (user_id, channel_id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (channel_id) REFERENCES channels(id)
        )
    """)

    conn.commit()


def seed_sample_data(conn: sqlite3.Connection) -> None:
    """
    Ładuje przykładowe dane do bazy (wywoływane tylko przy pierwszym uruchomieniu).

    Tworzy:
    - 3 użytkowników (Jan, Anna, Piotr)
    - 2 kanały publiczne (general, random)
    - Przypisuje użytkowników do kanałów
    - 7 przykładowych wiadomości w kanale general
    """
    cursor = conn.cursor()

    # Przykładowi użytkownicy
    users_data = [
        ("user_1", "Jan", "ircAMP2024!", get_timestamp()),
        ("user_2", "Anna", "ircAMP2024!", get_timestamp()),
        ("user_3", "Piotr", "ircAMP2024!", get_timestamp()),
    ]

    cursor.executemany(
        "INSERT INTO users (id, username, password_hash, created_at) VALUES (?, ?, ?, ?)",
        users_data
    )

    # Kanały publiczne
    channels_data = [
        ("general", "Ogólny", "public", get_timestamp()),
        ("random", "Ciekawostki", "public", get_timestamp()),
    ]

    cursor.executemany(
        "INSERT INTO channels (id, name, type, created_at) VALUES (?, ?, ?, ?)",
        channels_data
    )

    # Przypisanie wszystkich użytkowników do obu kanałów
    channel_members_data = []
    for user_id in ["user_1", "user_2", "user_3"]:
        for channel_id in ["general", "random"]:
            channel_members_data.append((user_id, channel_id))

    cursor.executemany(
        "INSERT INTO channel_members (user_id, channel_id) VALUES (?, ?)",
        channel_members_data
    )

    # Przykładowe wiadomości w kanale "general"
    # Używamy prostych ID jak msg_1, msg_2, etc.
    messages_data = [
        ("msg_1", "general", "user_2", "Cześć wszystkim!", get_timestamp()),
        ("msg_2", "general", "user_1", "Hej! Jak leci?", get_timestamp()),
        ("msg_3", "general", "user_3", "Witam! Super że tu jesteśmy", get_timestamp()),
        ("msg_4", "general", "user_2", "Ktoś już testował nowy projekt?", get_timestamp()),
        ("msg_5", "general", "user_1", "Ja zaczynam właśnie!", get_timestamp()),
        ("msg_6", "general", "user_3", "Trzymajcie się! Do roboty! 💪", get_timestamp()),
        ("msg_7", "general", "user_2", "Powodzenia wszystkim!", get_timestamp()),
    ]

    cursor.executemany(
        "INSERT INTO messages (id, channel_id, user_id, text, created_at) VALUES (?, ?, ?, ?, ?)",
        messages_data
    )

    conn.commit()
    print("   → 3 użytkowników dodanych (Jan, Anna, Piotr)")
    print("   → 2 kanały utworzone (general, random)")
    print("   → 7 przykładowych wiadomości w kanale general")


# ====== OPERACJE CRUD ======

def get_user_by_username(conn: sqlite3.Connection, username: str) -> Optional[User]:
    """
    Zwraca użytkownika o podanej nazwie.

    Args:
        conn: Połączenie z bazą danych
        username: Nazwa użytkownika do wyszukania

    Returns:
        User lub None jeśli nie znaleziono
    """
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, username, password_hash, created_at FROM users WHERE username = ?",
        (username,)
    )
    row = cursor.fetchone()

    if row:
        return User(
            id=row['id'],
            username=row['username'],
            password_hash=row['password_hash'],
            created_at=row['created_at']
        )
    return None


def get_channel_by_id(conn: sqlite3.Connection, channel_id: str) -> Optional[Channel]:
    """
    Zwraca kanał o podanym ID.

    Args:
        conn: Połączenie z bazą danych
        channel_id: ID kanału

    Returns:
        Channel lub None jeśli nie znaleziono
    """
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, name, type, created_at FROM channels WHERE id = ?",
        (channel_id,)
    )
    row = cursor.fetchone()

    if row:
        return Channel(
            id=row['id'],
            name=row['name'],
            type=row['type'],
            created_at=row['created_at']
        )
    return None


def get_all_channels(conn: sqlite3.Connection) -> List[Dict[str, Any]]:
    """
    Zwraca listę wszystkich kanałów.

    Args:
        conn: Połączenie z bazą danych

    Returns:
        Lista słowników z danymi kanałów
    """
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, type, created_at FROM channels ORDER BY created_at")
    rows = cursor.fetchall()

    channels = []
    for row in rows:
        channel = Channel(
            id=row['id'],
            name=row['name'],
            type=row['type'],
            created_at=row['created_at']
        )
        channels.append(channel.to_dict())

    return channels


def get_messages_for_channel(conn: sqlite3.Connection, channel_id: str, limit: int = 50) -> List[Dict[str, Any]]:
    """
    Zwraca ostatnie wiadomości z kanału.

    Args:
        conn: Połączenie z bazą danych
        channel_id: ID kanału
        limit: Maksymalna liczba wiadomości (domyślnie 50)

    Returns:
        Lista słowników z wiadomościami, posortowane chronologicznie
    """
    cursor = conn.cursor()
    cursor.execute("""
        SELECT m.id, m.channel_id, m.user_id, u.username, m.text, m.created_at, m.edited_at
        FROM messages m
        JOIN users u ON m.user_id = u.id
        WHERE m.channel_id = ?
        ORDER BY m.created_at ASC
        LIMIT ?
    """, (channel_id, limit))

    rows = cursor.fetchall()

    messages = []
    for row in rows:
        message = Message(
            id=row['id'],
            channel_id=row['channel_id'],
            user_id=row['user_id'],
            username=row['username'],
            text=row['text'],
            timestamp=row['created_at'],
            edited_at=row['edited_at']
        )
        messages.append(message.to_dict())

    return messages


def add_message(conn: sqlite3.Connection, channel_id: str, user_id: str, text: str) -> tuple[str, str]:
    """
    Dodaje nową wiadomość do bazy danych.

    Args:
        conn: Połączenie z bazą danych
        channel_id: ID kanału
        user_id: ID użytkownika
        text: Treść wiadomości

    Returns:
        Tuple (message_id, timestamp) - zwraca oba aby uniknąć race condition
    """
    cursor = conn.cursor()

    # Generowanie unikalnego ID używając UUID - eliminuje race condition
    message_id = f"msg_{uuid.uuid4().hex[:8]}"

    timestamp = get_timestamp()

    cursor.execute("""
        INSERT INTO messages (id, channel_id, user_id, text, created_at)
        VALUES (?, ?, ?, ?, ?)
    """, (message_id, channel_id, user_id, text, timestamp))

    conn.commit()

    return message_id, timestamp
