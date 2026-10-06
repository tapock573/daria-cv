Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile((Join-Path $PSScriptRoot "figma/Homepage_-_EN_-_1920.png"))

function Crop($y, $h, $name) {
    $rect = New-Object System.Drawing.Rectangle(0, $y, $img.Width, $h)
    $bmp = New-Object System.Drawing.Bitmap($img.Width, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.DrawImage($img, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $bmp.Save((Join-Path $PSScriptRoot $name))
    $g.Dispose()
    $bmp.Dispose()
    Write-Output "Saved $name"
}

Crop 2000 1200 "figma_projects_sample_2.png"
Crop 3000 1200 "figma_projects_sample_3.png"
$img.Dispose()
