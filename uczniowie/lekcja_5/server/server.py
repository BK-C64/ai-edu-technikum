"""
AI-Powered Team Chat - Backend Server

Główny plik serwera czatu opartego na FastAPI i WebSocket.

Funkcjonalności:
- Autentykacja użytkowników
- Wysyłanie i odbieranie wiadomości w czasie rzeczywistym
- Historia kanałów
- Zarządzanie sesjami użytkowników
- Obsługa wielu połączeń jednocześnie
"""

import sys
import os
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from database import init_database
from websocket_handler import (
    ConnectionManager,
    handle_auth_request,
    handle_send_message,
    handle_request_history,
    send_error
)

# Inicjalizacja aplikacji FastAPI
app = FastAPI(
    title="AI-Powered Team Chat API",
    description="Real-time chat application with WebSocket support",
    version="1.0.0"
)

# KRYTYCZNE: Konfiguracja CORS
# Bez tego frontend nie będzie mógł się połączyć z serwerem!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Dla celów edukacyjnych - akceptuj wszystkie źródła
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Globalna instancja ConnectionManager
manager = ConnectionManager()

# Połączenie z bazą danych (będzie zainicjalizowane w main())
db_connection = None


@app.get("/")
async def root():
    """
    Endpoint główny - sprawdzenie statusu serwera.

    Returns:
        JSON z informacją o statusie serwera
    """
    return {
        "status": "Server is running",
        "version": "1.0",
        "websocket_endpoint": "/ws"
    }


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    Główny endpoint WebSocket dla komunikacji z klientami.

    Proces:
    1. Akceptacja połączenia
    2. Oczekiwanie na auth_request
    3. Jeśli auth OK - pętla obsługi wiadomości
    4. Obsługa rozłączenia

    Args:
        websocket: Obiekt WebSocket z FastAPI
    """
    await websocket.accept()
    print("🔌 Nowe połączenie WebSocket")

    authenticated = False
    user_info = None

    try:
        # Faza 1: Autentykacja
        # Czekamy na auth_request jako pierwszą wiadomość
        auth_data_raw = await websocket.receive_text()
        auth_data = json.loads(auth_data_raw)

        if auth_data.get("type") != "auth_request":
            await send_error(websocket, "First message must be auth_request")
            await websocket.close()
            return

        # Obsłuż autentykację
        authenticated = await handle_auth_request(auth_data, websocket, manager, db_connection)

        if not authenticated:
            # Autentykacja nie powiodła się - połączenie już zamknięte przez handle_auth_request
            return

        # Faza 2: Główna pętla obsługi wiadomości
        while True:
            # Odbierz wiadomość od klienta
            message_raw = await websocket.receive_text()
            message = json.loads(message_raw)

            message_type = message.get("type")

            # Routing wiadomości do odpowiednich handlerów
            if message_type == "send_message":
                await handle_send_message(message, websocket, manager, db_connection)

            elif message_type == "request_history":
                await handle_request_history(message, websocket, db_connection)

            else:
                # Nieznany typ wiadomości
                await send_error(websocket, f"Unknown message type: {message_type}")

    except WebSocketDisconnect:
        # Klient rozłączył się
        print("🔌 Klient rozłączony")

    except json.JSONDecodeError:
        # Błędny format JSON
        await send_error(websocket, "Invalid JSON format")

    except Exception as e:
        # Ogólny błąd
        print(f"❌ Błąd WebSocket: {e}")

    finally:
        # Cleanup: Usuń połączenie i powiadom innych użytkowników
        if authenticated:
            user_info = manager.disconnect(websocket)

            if user_info:
                # Rozgłoś user_left
                user_left_msg = {
                    "type": "user_left",
                    "payload": {
                        "user": {
                            "id": user_info["user_id"],
                            "name": user_info["username"]
                        }
                    }
                }
                await manager.broadcast_to_all(user_left_msg)

                # Rozgłoś zaktualizowaną listę użytkowników
                online_users = manager.get_online_users()
                user_list_update = {
                    "type": "user_list_update",
                    "payload": {
                        "online_users": online_users
                    }
                }
                await manager.broadcast_to_all(user_list_update)

                print(f"✓ Użytkownik {user_info['username']} rozłączył się")


def main():
    """
    Funkcja główna - inicjalizacja i uruchomienie serwera.
    """
    global db_connection

    print("=" * 60)
    print("  AI-POWERED TEAM CHAT - Backend Server")
    print("=" * 60)

    # Inicjalizacja bazy danych
    db_connection = init_database()

    print("\n🚀 Uruchamianie serwera FastAPI...")
    print("   HTTP endpoint: http://localhost:8000")
    print("   WebSocket endpoint: ws://localhost:8000/ws")
    print("\n💡 Aby zatrzymać serwer, naciśnij Ctrl+C\n")

    # Uruchomienie serwera Uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",  # Nasłuchuj na wszystkich interfejsach
        port=8000,
        log_level="info"
    )


if __name__ == "__main__":
    # Obsługa flagi --reset
    if "--reset" in sys.argv:
        if os.path.exists('chat.db'):
            os.remove('chat.db')
            print("🔄 Baza danych została zresetowana")
            print("")
        else:
            print("ℹ️  Brak pliku bazy danych do zresetowania")
            print("")

    main()
