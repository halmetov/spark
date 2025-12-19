import os

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import connections


class Command(BaseCommand):
    help = "Print the active database connection details (without passwords)."

    def handle(self, *args, **options):
        conn_settings = connections["default"].settings_dict
        engine = conn_settings.get("ENGINE")
        name = conn_settings.get("NAME")
        host = conn_settings.get("HOST")
        port = conn_settings.get("PORT")
        user = conn_settings.get("USER")

        self.stdout.write("Active database configuration:")
        self.stdout.write(f"  ENGINE: {engine}")
        self.stdout.write(f"  NAME:   {name}")
        self.stdout.write(f"  HOST:   {host}")
        self.stdout.write(f"  PORT:   {port}")
        self.stdout.write(f"  USER:   {user}")
        self.stdout.write(f"  DEBUG:  {settings.DEBUG}")
        self.stdout.write(f"  DATABASE_URL present: {bool(os.getenv('DATABASE_URL'))}")
