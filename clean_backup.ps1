$json = Get-Content 'sqlite_export.json' -Raw | ConvertFrom-Json
$filtered = $json | Where-Object { $_.model -notin 'contenttypes.contenttype', 'auth.permission', 'sessions.session', 'admin.logentry' }
$filtered | ConvertTo-Json -Depth 10 | Set-Content 'cleaned_backup.json'
