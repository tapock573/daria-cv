Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile((Join-Path $PSScriptRoot "p3_render_1920.png"))
Write-Output "Size: $($img.Width) x $($img.Height)"

# Crop projects area (y=1080 to 2200)
$rect = New-Object System.Drawing.Rectangle(0, 1080, $img.Width, [Math]::Min(1500, $img.Height - 1080))
$bmp = New-Object System.Drawing.Bitmap($img.Width, $rect.Height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($img, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
$bmp.Save((Join-Path $PSScriptRoot "crop_work_1920.png"))
$g.Dispose()
$bmp.Dispose()
$img.Dispose()
Write-Output "Done crop"
