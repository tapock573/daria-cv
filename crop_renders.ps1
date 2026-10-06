Add-Type -AssemblyName System.Drawing

function CropRender($src, $dst, $x, $y, $w, $h) {
    $fullSrc = Join-Path $PSScriptRoot $src
    $fullDst = Join-Path $PSScriptRoot $dst
    if (-not (Test-Path $fullSrc)) { Write-Output "Not found: $fullSrc"; return }
    $img = [System.Drawing.Image]::FromFile($fullSrc)
    if ($x + $w -gt $img.Width) { $w = $img.Width - $x }
    if ($y + $h -gt $img.Height) { $h = $img.Height - $y }
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.DrawImage($img, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $bmp.Save($fullDst)
    $g.Dispose()
    $bmp.Dispose()
    $img.Dispose()
    Write-Output "Saved $dst"
}

CropRender "render_1920_hero.png" "crop_test_1920.png" 0 700 750 350
CropRender "render_1440_hero.png" "crop_test_1440.png" 0 500 700 350
CropRender "render_1024_hero.png" "crop_test_1024.png" 0 450 700 350
CropRender "render_768_hero.png" "crop_test_768.png" 0 450 768 350
CropRender "render_360_hero.png" "crop_test_360.png" 0 350 360 350
