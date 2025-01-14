#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NEWSREADERWEBSITEPROJECT.settings')

    try:
        from django.core.management import execute_from_command_line

        # Check if PORT environment variable is set, default to 8000 if not
        port = os.environ.get('PORT', '8000')  # Default to 8000 if PORT is not set

        # If running the server, bind to all interfaces on the specified port
        if 'runserver' in sys.argv:
            execute_from_command_line(["manage.py", "runserver", f"0.0.0.0:{port}"])
        else:
            execute_from_command_line(sys.argv)

    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

if __name__ == '__main__':
    main()
