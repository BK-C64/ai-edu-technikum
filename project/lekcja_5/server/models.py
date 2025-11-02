"""
Modele danych dla aplikacji czatu.

Ten moduł definiuje struktury danych używane w całej aplikacji.
"""

from dataclasses import dataclass
from typing import Optional


@dataclass
class User:
    """Model użytkownika"""
    id: str
    username: str
    password_hash: str
    created_at: str

    def to_dict(self) -> dict:
        """Konwersja do słownika (bez hasła dla bezpieczeństwa)"""
        return {
            "id": self.id,
            "name": self.username
        }


@dataclass
class Channel:
    """Model kanału"""
    id: str
    name: str
    type: str  # 'public' lub 'private'
    created_at: str

    def to_dict(self) -> dict:
        """Konwersja do słownika"""
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type
        }


@dataclass
class Message:
    """Model wiadomości"""
    id: str
    channel_id: str
    user_id: str
    username: str
    text: str
    timestamp: str
    edited_at: Optional[str] = None

    def to_dict(self) -> dict:
        """Konwersja do słownika zgodnie z api_design.md"""
        message_dict = {
            "id": self.id,
            "user": {
                "id": self.user_id,
                "name": self.username
            },
            "text": self.text,
            "timestamp": self.timestamp
        }

        if self.edited_at:
            message_dict["edited_at"] = self.edited_at

        return message_dict
