Add-Type -AssemblyName System.Drawing

function FindP3Title($fileName, $outName) {
    $fullSrc = Join-Path $PSScriptRoot $fileName
    $fullDst = Join-Path $PSScriptRoot $outName
    $img = [System.Drawing.Image]::FromFile($fullSrc)
    $w = [Math]::Min(800, $img.Width)
    $y = [int]($img.Height * 0.38) - 700
    if ($y -lt 0) { $y = 0 }
    $rect = New-Object System.Drawing.Rectangle(0, $y, $w, 800)
    $bmp = New-Object System.Drawing.Bitmap($w, 800)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.DrawImage($img, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $bmp.Save($fullDst)
    $g.Dispose()
    $bmp.Dispose()
    $img.Dispose()
    Write-Output "Saved $outName"
}

FindP3Title "figma/Homepage_-_EN_-_1440.png" "figma/p3_title_1440.png"
FindP3Title "figma/Homepage_-_EN_-_1024.png" "figma/p3_title_1024.png"
FindP3Title "figma/Homepage_-_EN_-_768.png" "figma/p3_title_768.png"
FindP3Title "figma/Homepage_-_EN_-_360.png" "figma/p3_title_360.png"
