$text = Get-Content 'real_cleaned_backup.json' -Raw
[System.IO.File]::WriteAllText("c:\Users\USER\CyberPoa\CyberPoa\real_cleaned_backup.json", $text, (New-Object System.Text.UTF8Encoding $False))
