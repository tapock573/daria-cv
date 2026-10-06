Add-Type -AssemblyName System.Drawing

function CropExact($filePath, $dstPath, $x, $y, $w, $h) {
    $fullSrc = Join-Path $PSScriptRoot $filePath
    $fullDst = Join-Path $PSScriptRoot $dstPath
    $img = [System.Drawing.Image]::FromFile($fullSrc)
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.DrawImage($img, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $bmp.Save($fullDst)
    $g.Dispose()
    $bmp.Dispose()
    $img.Dispose()
}

CropExact "figma/Homepage_-_EN_-_1440.png" "figma/exact_desc_1440.png" 0 500 600 300
CropExact "figma/Homepage_-_EN_-_1024.png" "figma/exact_desc_1024.png" 0 450 600 300
CropExact "figma/Homepage_-_EN_-_768.png" "figma/exact_desc_768.png" 0 400 600 300
Write-Output "Done"
