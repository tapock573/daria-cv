Add-Type -AssemblyName System.Drawing

function CropArea($src, $dst, $x, $y, $w, $h) {
    $fullSrc = Join-Path $PSScriptRoot $src
    $fullDst = Join-Path $PSScriptRoot $dst
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

# In 1920, Project 3 is around y=2000-2800
CropArea "p3_render_1920.png" "crop_p3_rendered_1920.png" 0 2000 800 600
CropArea "p3_render_1440.png" "crop_p3_rendered_1440.png" 0 1600 700 600
