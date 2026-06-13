"""Shared Supabase client factory"""
from supabase import create_client, Client
import os

def get_supabase(service_role: bool = False) -> Client:
    url = os.getenv("SUPABASE_URL", "")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY" if service_role else "SUPABASE_ANON_KEY", "")
    return create_client(url, key)

