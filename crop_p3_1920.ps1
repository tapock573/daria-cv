Add-Type -AssemblyName System.Drawing
$fullSrc = Join-Path $PSScriptRoot "figma/Homepage_-_EN_-_1920.png"
$fullDst = Join-Path $PSScriptRoot "figma/p3_title_1920_full.png"
$img = [System.Drawing.Image]::FromFile($fullSrc)
$rect = New-Object System.Drawing.Rectangle(0, 3300, 1000, 500)
$bmp = New-Object System.Drawing.Bitmap(1000, 500)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($img, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
$bmp.Save($fullDst)
$g.Dispose()
$bmp.Dispose()
$img.Dispose()
Write-Output "Done"
