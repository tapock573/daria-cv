$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$url = "file:///C:/Users/Admin/daria-portfolio/index.html?lang=en#work"

$s1920 = Join-Path $PSScriptRoot "p3_render_1920.png"
$s1440 = Join-Path $PSScriptRoot "p3_render_1440.png"
$s1024 = Join-Path $PSScriptRoot "p3_render_1024.png"
$s768  = Join-Path $PSScriptRoot "p3_render_768.png"

# We can run headless with virtual time budget to allow scrolling to #work or scroll via a test page
# Or we can capture the full page or screenshot directly with window height
& $edge --headless --disable-gpu --window-size=1920,3500 "--screenshot=$s1920" $url
& $edge --headless --disable-gpu --window-size=1440,3000 "--screenshot=$s1440" $url
& $edge --headless --disable-gpu --window-size=1024,3000 "--screenshot=$s1024" $url
& $edge --headless --disable-gpu --window-size=768,3000 "--screenshot=$s768" $url

Write-Output "Captured p3 renders"
