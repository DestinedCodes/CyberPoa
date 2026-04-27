$code = @"

def reset_mnjala(request):
    from django.contrib.auth.models import User
    from django.http import HttpResponse
    try:
        u = User.objects.get(username='Mnjala')
        u.set_password('Mnjala2026!')
        u.save()
        return HttpResponse('Password successfully reset to Mnjala2026!')
    except Exception as e:
        return HttpResponse('Error: ' + str(e))
"@

Add-Content -Path "c:/Users/USER/CyberPoa/CyberPoa/core/views.py" -Value $code
