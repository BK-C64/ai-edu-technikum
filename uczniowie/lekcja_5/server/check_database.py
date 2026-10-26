"""
Prosty skrypt do sprawdzania zawartości bazy danych.
Użycie: python check_database.py
"""

import sqlite3
import os

def main():
    db_path = "chat.db"

    if not os.path.exists(db_path):
        print("❌ Baza danych nie istnieje!")
        print("   Uruchom najpierw serwer: python server.py")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    print("=" * 60)
    print("  ZAWARTOŚĆ BAZY DANYCH - AI CHAT")
    print("=" * 60)

    # Użytkownicy
    print("\n👥 UŻYTKOWNICY:")
    print("-" * 60)
    cursor.execute("SELECT id, username, created_at FROM users")
    users = cursor.fetchall()

    if users:
        for user_id, username, created_at in users:
            print(f"  • {username:15} (ID: {user_id:10}) - {created_at}")
    else:
        print("  (brak użytkowników)")

    # Kanały
    print("\n📺 KANAŁY:")
    print("-" * 60)
    cursor.execute("SELECT id, name, type FROM channels")
    channels = cursor.fetchall()

    if channels:
        for channel_id, name, channel_type in channels:
            # Policz wiadomości w kanale
            cursor.execute("SELECT COUNT(*) FROM messages WHERE channel_id = ?", (channel_id,))
            msg_count = cursor.fetchone()[0]
            print(f"  • {name:15} ({channel_id:10}) - {msg_count} wiadomości")
    else:
        print("  (brak kanałów)")

    # Wiadomości (ostatnie 10)
    print("\n💬 OSTATNIE WIADOMOŚCI (10 najnowszych):")
    print("-" * 60)
    cursor.execute("""
        SELECT m.text, u.username, m.channel_id, m.created_at
        FROM messages m
        JOIN users u ON m.user_id = u.id
        ORDER BY m.created_at DESC
        LIMIT 10
    """)
    messages = cursor.fetchall()

    if messages:
        for text, username, channel_id, created_at in messages:
            text_preview = text[:50] + "..." if len(text) > 50 else text
            print(f"  [{channel_id:10}] {username:10}: {text_preview}")
            print(f"               └─ {created_at}")
    else:
        print("  (brak wiadomości)")

    # Statystyki
    print("\n📊 STATYSTYKI:")
    print("-" * 60)

    cursor.execute("SELECT COUNT(*) FROM users")
    user_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM channels")
    channel_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM messages")
    message_count = cursor.fetchone()[0]

    print(f"  Użytkownicy: {user_count}")
    print(f"  Kanały:      {channel_count}")
    print(f"  Wiadomości:  {message_count}")

    conn.close()

    print("\n" + "=" * 60)
    print("✓ Sprawdzanie zakończone")
    print("=" * 60)


if __name__ == "__main__":
    main()
