$content = Get-Content -Path 'vivid.css' -Raw
$matches = [regex]::Matches($content, '([^{}]+)\{([^}]+)\}')
foreach ($m in $matches) {
    $sel = $m.Groups[1].Value
    $body = $m.Groups[2].Value
    if ($sel -match 'work-list' -or $sel -match 'work-intro' -or $sel -match 'work-text') {
        Write-Output "$sel { $body }"
    }
}
