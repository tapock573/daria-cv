$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$url = "file:///C:/Users/Admin/daria-portfolio/index.html"

# Test 1: Desktop 1920 at #work
$out1 = Join-Path $PSScriptRoot "test_work_1920.png"
& $edge --headless --disable-gpu --window-size=1920,1080 "--screenshot=$out1" "$url#work"

Write-Output "Screenshot saved: $out1"
