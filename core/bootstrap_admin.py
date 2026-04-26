import os

from django.contrib.auth import get_user_model
from django.db.utils import OperationalError, ProgrammingError


def bootstrap_superuser():
    enabled = os.getenv('BOOTSTRAP_SUPERUSER_ENABLED', '').lower() == 'true'
    username = os.getenv('BOOTSTRAP_SUPERUSER_USERNAME', '').strip()
    email = os.getenv('BOOTSTRAP_SUPERUSER_EMAIL', '').strip()
    password = os.getenv('BOOTSTRAP_SUPERUSER_PASSWORD', '')

    if not enabled or not username or not password:
        return

    User = get_user_model()

    try:
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'email': email,
                'is_active': True,
                'is_staff': True,
                'is_superuser': True,
            },
        )
    except (OperationalError, ProgrammingError):
        return

    updated_fields = []

    if email and user.email != email:
        user.email = email
        updated_fields.append('email')
    if not user.is_active:
        user.is_active = True
        updated_fields.append('is_active')
    if not user.is_staff:
        user.is_staff = True
        updated_fields.append('is_staff')
    if not user.is_superuser:
        user.is_superuser = True
        updated_fields.append('is_superuser')

    if created or not user.has_usable_password() or password:
        user.set_password(password)
        updated_fields.append('password')

    if created:
        user.save()
    elif updated_fields:
        user.save(update_fields=list(dict.fromkeys(updated_fields)))
