"""LiveKit token generation"""
from livekit.api import AccessToken, VideoGrants
from config import settings

def generate_token(user_id: str, room_name: str) -> str:
    token = AccessToken(settings.LIVEKIT_API_KEY, settings.LIVEKIT_API_SECRET)
    token.identity = user_id
    token.add_grant(VideoGrants(room_join=True, room=room_name))
    return token.to_jwt()

