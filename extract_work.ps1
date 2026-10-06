$cssUrl = "https://cdn.prod.website-files.com/6a146adad6e18d5b32d80021/css/vividmotion-co---new-website.shared.064e22ae7.css"
$cssFile = Join-Path $PSScriptRoot "vivid.css"
if (-not (Test-Path $cssFile)) {
    Invoke-WebRequest -Uri $cssUrl -OutFile $cssFile
}
$content = Get-Content -Path $cssFile -Raw
$matches = [regex]::Matches($content, '\.work-list[^{]*\{[^}]*\}')
foreach ($m in $matches) {
    Write-Output $m.Value
}
