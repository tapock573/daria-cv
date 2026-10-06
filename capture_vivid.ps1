$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$url = "https://www.vividmotion.co/"
$out = Join-Path $PSScriptRoot "vivid_full.png"
& $edge --headless --disable-gpu --window-size=1920,1080 "--screenshot=$out" $url
Write-Output "Done"
