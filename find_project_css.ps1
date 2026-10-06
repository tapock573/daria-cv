$lines = Get-Content -Path "style.css"
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'project-' -or $lines[$i] -match 'projects-' -or $lines[$i] -match 'mockup-img') {
        Write-Output "$($i + 1): $($lines[$i])"
    }
}
