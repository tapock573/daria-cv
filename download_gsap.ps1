$gsapUrl = "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"
$stUrl = "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"
$gsapDst = Join-Path $PSScriptRoot "assets/gsap.min.js"
$stDst = Join-Path $PSScriptRoot "assets/ScrollTrigger.min.js"

Invoke-WebRequest -Uri $gsapUrl -OutFile $gsapDst
Invoke-WebRequest -Uri $stUrl -OutFile $stDst

Write-Output "GSAP downloaded: $((Get-Item $gsapDst).Length) bytes"
Write-Output "ScrollTrigger downloaded: $((Get-Item $stDst).Length) bytes"
