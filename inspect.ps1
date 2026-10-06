Add-Type -AssemblyName System.Drawing

function CropArea($filePath, $dstPath, $x, $y, $w, $h) {
    $fullSrc = Join-Path $PSScriptRoot $filePath
    $fullDst = Join-Path $PSScriptRoot $dstPath
    if (-not (Test-Path $fullSrc)) { Write-Output "Not found: $fullSrc"; return }
    $img = [System.Drawing.Image]::FromFile($fullSrc)
    if ($x + $w -gt $img.Width) { $w = $img.Width - $x }
    if ($y + $h -gt $img.Height) { $h = $img.Height - $y }
    if ($w -le 0 -or $h -le 0) { $img.Dispose(); return }
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.DrawImage($img, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $bmp.Save($dstPath)
    $g.Dispose()
    $bmp.Dispose()
    $img.Dispose()
    Write-Output "Saved $dstPath"
}

# Check hero description for 1920, 1440, 1024, 768, 360
CropArea "figma/Homepage_-_EN_-_1920.png" "figma/crop_en_hero_desc_1920.png" 0 700 700 350
CropArea "figma/Homepage_-_EN_-_1440.png" "figma/crop_en_hero_desc_1440.png" 0 700 700 350
CropArea "figma/Homepage_-_EN_-_1024.png" "figma/crop_en_hero_desc_1024.png" 0 600 700 350
CropArea "figma/Homepage_-_EN_-_768.png" "figma/crop_en_hero_desc_768.png" 0 500 768 400
CropArea "figma/Homepage_-_EN_-_360.png" "figma/crop_en_hero_desc_360.png" 0 400 360 350

# Check Project 3 title in 1920, 1440, 1024, 768, 360
CropArea "figma/Homepage_-_EN_-_1920.png" "figma/crop_en_p3_1920.png" 0 4500 700 400
CropArea "figma/Homepage_-_EN_-_1440.png" "figma/crop_en_p3_1440.png" 0 4500 700 400
CropArea "figma/Homepage_-_EN_-_1024.png" "figma/crop_en_p3_1024.png" 0 3500 700 400
CropArea "figma/Homepage_-_EN_-_768.png" "figma/crop_en_p3_768.png" 0 3500 768 400
CropArea "figma/Homepage_-_EN_-_360.png" "figma/crop_en_p3_360.png" 0 2000 360 400
