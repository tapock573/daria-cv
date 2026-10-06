Add-Type -AssemblyName System.Drawing

$src = "C:\Users\Admin\AppData\Local\Packages\MicrosoftWindows.Client.Core_cw5n1h2txyewy\TempState\ScreenClip\{19205738-4205-49DB-A647-1FE9BA4FE1BA}.png"
$bmp = [System.Drawing.Bitmap]::FromFile($src)
# The hover row is in the lower half of the component
$cHover = $bmp.GetPixel(300, 180)
$cDef = $bmp.GetPixel(300, 60)
Write-Host "Default BG: R=$($cDef.R), G=$($cDef.G), B=$($cDef.B)"
Write-Host "Hover BG: R=$($cHover.R), G=$($cHover.G), B=$($cHover.B)"

$bmp.Dispose()
