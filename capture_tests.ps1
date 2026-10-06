$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$url = "file:///C:/Users/Admin/daria-portfolio/index.html?lang=en"

$s1920 = Join-Path $PSScriptRoot "render_1920_hero.png"
$s1440 = Join-Path $PSScriptRoot "render_1440_hero.png"
$s1024 = Join-Path $PSScriptRoot "render_1024_hero.png"
$s768  = Join-Path $PSScriptRoot "render_768_hero.png"
$s360  = Join-Path $PSScriptRoot "render_360_hero.png"

& $edge --headless --disable-gpu --window-size=1920,1080 "--screenshot=$s1920" $url
& $edge --headless --disable-gpu --window-size=1440,900 "--screenshot=$s1440" $url
& $edge --headless --disable-gpu --window-size=1024,768 "--screenshot=$s1024" $url
& $edge --headless --disable-gpu --window-size=768,1024 "--screenshot=$s768" $url
& $edge --headless --disable-gpu --window-size=360,800 "--screenshot=$s360" $url

Write-Output "Captured all hero screenshots with absolute paths"
