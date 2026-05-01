$code = @"

def run_migration(request):
    import os
    import threading
    from django.core.management import call_command
    from django.conf import settings
    from django.http import HttpResponse

    backup_file = os.path.join(settings.BASE_DIR, 'real_cleaned_backup.json')
    if not os.path.exists(backup_file):
        return HttpResponse('Backup file not found at ' + backup_file, status=404)

    def background_task():
        try:
            print("Starting background migration...")
            call_command('flush', '--noinput')
            print("Flush complete. Loading data...")
            call_command('loaddata', backup_file)
            print("Migration completely successful!")
        except Exception as e:
            import traceback
            print("MIGRATION FAILED:")
            print(traceback.format_exc())

    thread = threading.Thread(target=background_task)
    thread.daemon = True
    thread.start()

    return HttpResponse('Migration has been started in the background! Please wait about 30-60 seconds, then try logging in normally.', content_type='text/plain')
"@

# Remove the old run_migration and append the new one
$content = Get-Content "c:/Users/USER/CyberPoa/CyberPoa/core/views.py" -Raw
$content = $content -replace 'def run_migration\(request\):[\s\S]*', $code
[System.IO.File]::WriteAllText("c:\Users\USER\CyberPoa\CyberPoa\core\views.py", $content, (New-Object System.Text.UTF8Encoding $False))
