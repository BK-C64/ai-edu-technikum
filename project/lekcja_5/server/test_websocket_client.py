"""
Prosty klient testowy WebSocket dla serwera czatu.

Ten skrypt pozwala na przetestowanie serwera bez frontendu.
Użycie: python test_websocket_client.py

Wymagania: pip install websockets
"""

import asyncio
import websockets
import json
import sys


async def receive_message_of_type(websocket, expected_type, timeout=5):
    """
    Odbiera wiadomości aż znajdzie właściwy typ lub timeout.
    Pomija broadcast'y typu user_list_update które mogą przychodzić w tle.
    """
    start_time = asyncio.get_event_loop().time()

    while True:
        # Sprawdź timeout
        if asyncio.get_event_loop().time() - start_time > timeout:
            raise TimeoutError(f"Nie otrzymano wiadomości typu '{expected_type}' w ciągu {timeout}s")

        try:
            response = await asyncio.wait_for(websocket.recv(), timeout=1.0)
            data = json.loads(response)

            # Jeśli to właściwy typ - zwróć
            if data["type"] == expected_type:
                return data

            # Pomijamy user_list_update (broadcast w tle)
            if data["type"] == "user_list_update":
                print(f"  (pomijam broadcast: user_list_update)")
                continue

            # Pomijamy user_joined (broadcast w tle)
            if data["type"] == "user_joined":
                print(f"  (pomijam broadcast: user_joined)")
                continue

            # Inny nieoczekiwany typ
            print(f"  ⚠️  Otrzymano nieoczekiwany typ: {data['type']} (oczekiwano: {expected_type})")
            continue

        except asyncio.TimeoutError:
            continue


async def test_chat_server():
    """
    Testuje podstawową funkcjonalność serwera czatu.
    """
    uri = "ws://localhost:8000/ws"

    print("=" * 60)
    print("  Test Klienta WebSocket - AI Chat")
    print("=" * 60)
    print(f"\nŁączenie z: {uri}")

    try:
        async with websockets.connect(uri) as websocket:
            print("✓ Połączono z serwerem\n")

            # Test 1: Autentykacja
            print("Test 1: Autentykacja...")
            auth_msg = {
                "type": "auth_request",
                "payload": {
                    "username": "Jan",
                    "password": "ircAMP2024!"
                }
            }
            await websocket.send(json.dumps(auth_msg, ensure_ascii=False))

            data = await receive_message_of_type(websocket, "auth_success")

            if data["type"] == "auth_success":
                print("✓ Autentykacja pomyślna!")
                user_info = data["payload"]["user_info"]
                channels = data["payload"]["channels"]
                online_users = data["payload"]["online_users"]
                history = data["payload"]["initial_channel_history"]["messages"]

                print(f"  → User: {user_info['name']} (ID: {user_info['id']})")
                print(f"  → Kanały: {len(channels)}")
                for ch in channels:
                    print(f"     - {ch['name']} ({ch['id']})")
                print(f"  → Online users: {len(online_users)}")
                print(f"  → Historia general: {len(history)} wiadomości")
                if history:
                    print(f"     Pierwsza: {history[0]['user']['name']}: {history[0]['text'][:40]}...")
            else:
                print(f"✗ Autentykacja nieudana: {data}")
                return

            # Test 2: Wysłanie wiadomości
            print("\nTest 2: Wysłanie wiadomości...")
            send_msg = {
                "type": "send_message",
                "payload": {
                    "channel_id": "general",
                    "text": "Testowa wiadomość z polskimi znakami: żółć! 🎉"
                }
            }
            await websocket.send(json.dumps(send_msg, ensure_ascii=False))

            # Odbierz broadcast (nasza własna wiadomość)
            data = await receive_message_of_type(websocket, "new_message")

            if data["type"] == "new_message":
                msg = data["payload"]["message"]
                print("✓ Wiadomość wysłana i otrzymana!")
                print(f"  → Od: {msg['user']['name']}")
                print(f"  → Tekst: {msg['text']}")
                print(f"  → Timestamp: {msg['timestamp']}")
            else:
                print(f"✗ Nieoczekiwana odpowiedź: {data['type']}")

            # Test 3: Żądanie historii
            print("\nTest 3: Żądanie historii kanału 'random'...")
            history_req = {
                "type": "request_history",
                "payload": {
                    "channel_id": "random"
                }
            }
            await websocket.send(json.dumps(history_req))

            data = await receive_message_of_type(websocket, "chat_history")

            if data["type"] == "chat_history":
                messages = data["payload"]["messages"]
                print(f"✓ Historia otrzymana!")
                print(f"  → Kanał: {data['payload']['channel_id']}")
                print(f"  → Wiadomości: {len(messages)}")
                if len(messages) == 0:
                    print("     (kanał jest pusty)")
            else:
                print(f"✗ Nieoczekiwana odpowiedź: {data['type']}")

            # Test 4: Walidacja błędów
            print("\nTest 4: Test walidacji (zbyt długa wiadomość)...")
            invalid_msg = {
                "type": "send_message",
                "payload": {
                    "channel_id": "general",
                    "text": "x" * 301  # Przekroczenie limitu 300 znaków
                }
            }
            await websocket.send(json.dumps(invalid_msg))

            data = await receive_message_of_type(websocket, "error_message")

            if data["type"] == "error_message":
                print(f"✓ Walidacja działa!")
                print(f"  → Błąd: {data['payload']['message']}")
            else:
                print(f"✗ Oczekiwano error_message, otrzymano: {data['type']}")

            print("\n" + "=" * 60)
            print("  ✓ Wszystkie testy zakończone pomyślnie!")
            print("=" * 60)
            print("\nKlient zamknie się za 2 sekundy...")
            await asyncio.sleep(2)

    except ConnectionRefusedError:
        print("✗ Nie można połączyć się z serwerem!")
        print("   Czy serwer działa? Uruchom: python server.py")
        sys.exit(1)

    except Exception as e:
        print(f"✗ Błąd: {e}")
        sys.exit(1)


if __name__ == "__main__":
    print("\nUwaga: Upewnij się że serwer jest uruchomiony (python server.py)\n")

    try:
        asyncio.run(test_chat_server())
    except KeyboardInterrupt:
        print("\n\nTest przerwany przez użytkownika")
