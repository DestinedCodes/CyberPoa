$code = @"

def debug_mnjala(request):
    from django.http import JsonResponse
    from django.contrib.auth.models import User
    from core.models import BusinessProfile
    try:
        u = User.objects.get(username='Mnjala')
        b = BusinessProfile.objects.filter(owner=u).first()
        p = getattr(u, 'profile', None)
        return JsonResponse({'user_id': u.id, 'is_active': u.is_active, 'b_id': b.id if b else None, 'b_status': getattr(b, 'approval_status', None) if b else None, 'p_role': getattr(p, 'role', None) if p else None})
    except Exception as e:
        return JsonResponse({'error': str(e)})
"@

Add-Content -Path "c:/Users/USER/CyberPoa/CyberPoa/core/views.py" -Value $code
