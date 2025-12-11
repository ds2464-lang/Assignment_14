# Simple in-memory blacklist for tokens (for educational use only)

_blacklist = set()

async def add_to_blacklist(jti: str):
    _blacklist.add(jti)

async def is_blacklisted(jti: str) -> bool:
    return jti in _blacklist