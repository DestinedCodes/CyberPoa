$code = @"

def run_migration(request):
    from django.core.management import call_command
    import traceback
    from io import StringIO
    import os
    from django.conf import settings
    from django.http import HttpResponse
    
    output = StringIO()
    try:
        backup_file = os.path.join(settings.BASE_DIR, 'real_cleaned_backup.json')
        if not os.path.exists(backup_file):
            return HttpResponse('Backup file not found at ' + backup_file, status=404)
        
        call_command('loaddata', backup_file, stdout=output, verbosity=3)
        return HttpResponse('RESTORE SUCCESS!\n\n' + output.getvalue(), content_type='text/plain')
    except Exception as e:
        return HttpResponse('RESTORE FAILED!\n\n' + traceback.format_exc() + '\n\nOutput so far:\n' + output.getvalue(), content_type='text/plain')
"@

Add-Content -Path "c:/Users/USER/CyberPoa/CyberPoa/core/views.py" -Value $code
