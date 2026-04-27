$json = Get-Content 'real_backup.json' -Raw | ConvertFrom-Json
$filtered = $json | Where-Object { $_.model -notin 'contenttypes.contenttype', 'auth.permission', 'admin.logentry', 'sessions.session' }
$filtered | ConvertTo-Json -Depth 10 | Set-Content 'real_cleaned_backup.json' -Encoding UTF8
