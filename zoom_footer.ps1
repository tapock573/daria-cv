Add-Type -AssemblyName System.Drawing

$src = (Get-ChildItem -LiteralPath "C:\Users\Admin\Downloads" | Where-Object { $_.Name -like "*Homepage*3*.png" }).FullName
$bmp = [System.Drawing.Bitmap]::FromFile($src)
# Footer heading is around Y: 8900 to 9500, X: 70 to 1100
# Let's crop the text area
$rect = [System.Drawing.Rectangle]::new(75, 9300, 1050, 150)
$crop = $bmp.Clone($rect, $bmp.PixelFormat)
$crop.Save("C:\Users\Admin\daria-portfolio\zoom_footer_text.png", [System.Drawing.Imaging.ImageFormat]::Png)
$crop.Dispose()
$bmp.Dispose()
Write-Host "Saved zoom_footer_text.png"
