$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$port = 9339
$userData = "C:\Users\Admin\daria-portfolio\temp_chrome_verify_vivid"

if (Test-Path $userData) {
  Remove-Item -Path $userData -Recurse -Force -ErrorAction SilentlyContinue
}

$proc = Start-Process -FilePath $chromePath -ArgumentList "--remote-debugging-port=$port", "--headless=new", "--window-size=1920,1080", "--user-data-dir=$userData", "about:blank" -PassThru
Start-Sleep -Seconds 2

try {
  $targets = Invoke-RestMethod -Uri "http://localhost:$port/json/list"
  $page = $targets | Where-Object { $_.type -eq "page" } | Select-Object -First 1
  $wsUri = [System.Uri]$page.webSocketDebuggerUrl
  $ws = New-Object System.Net.WebSockets.ClientWebSocket
  $cts = New-Object System.Threading.CancellationTokenSource
  $ws.ConnectAsync($wsUri, $cts.Token).Wait(5000)

  function Send-CDP($method, $params = @{}) {
    $script:msgId = ($script:msgId -as [int]) + 1
    $payload = @{ id = $script:msgId; method = $method; params = $params } | ConvertTo-Json -Compress
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
    $segment = [System.ArraySegment[byte]]::new($bytes)
    $ws.SendAsync($segment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $cts.Token).Wait(5000)

    $buffer = New-Object byte[] 65536
    $ms = New-Object System.IO.MemoryStream
    while ($true) {
      $segment = [System.ArraySegment[byte]]::new($buffer)
      $recvTask = $ws.ReceiveAsync($segment, $cts.Token)
      $recvTask.Wait(10000)
      $res = $recvTask.Result
      $ms.Write($buffer, 0, $res.Count)
      if ($res.EndOfMessage) {
        $jsonStr = [System.Text.Encoding]::UTF8.GetString($ms.ToArray())
        $ms.SetLength(0)
        $obj = $jsonStr | ConvertFrom-Json
        if ($obj.id -eq $script:msgId) { return $obj }
      }
    }
  }

  function Exec-JS($expression) {
    $r = Send-CDP "Runtime.evaluate" @{ expression = $expression; returnByValue = $true; awaitPromise = $true }
    return $r.result.result.value
  }

  function Take-Screenshot($path) {
    $r = Send-CDP "Page.captureScreenshot" @{ format = "png" }
    [System.IO.File]::WriteAllBytes($path, [System.Convert]::FromBase64String($r.result.data))
    Write-Output "Screenshot saved: $path"
  }

  Send-CDP "Emulation.setDeviceMetricsOverride" @{
    width = 1920
    height = 1080
    deviceScaleFactor = 1
    mobile = $false
  }

  Send-CDP "Page.navigate" @{ url = "file:///C:/Users/Admin/daria-portfolio/index.html" }
  Start-Sleep -Seconds 3

  # Check that GSAP and ScrollTrigger are loaded and working
  $gsapCheck = Exec-JS "typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined'"
  Write-Output "GSAP and ScrollTrigger loaded: $gsapCheck"

  # 1. Scroll to Project 1
  Write-Output "Scrolling to Project 1..."
  Exec-JS "window.scrollToProject(0)"
  Start-Sleep -Seconds 2

  $p1State = Exec-JS @"
  (() => {
    const title = document.querySelector('.projects-titles-track .project-title.is-active');
    const client = document.querySelector('.projects-clients-track .client-badge.is-active');
    const sticky = document.querySelector('.projects-sticky-col');
    const card0 = document.querySelector('.project-card[data-project-idx=\"0\"]');
    const wrap0 = card0 ? card0.querySelector('.project-media-wrap') : null;
    return {
      scrollY: window.scrollY,
      stickyTop: sticky ? sticky.getBoundingClientRect().top : null,
      titleText: title ? title.textContent.trim() : null,
      titleOpacity: title ? window.getComputedStyle(title).opacity : null,
      clientName: client ? client.querySelector('.client-name').textContent.trim() : null,
      clientOpacity: client ? window.getComputedStyle(client).opacity : null,
      card0Active: card0 ? card0.classList.contains('is-active') : false,
      card0Opacity: wrap0 ? window.getComputedStyle(wrap0).opacity : null
    };
  })()
"@
  Write-Output "Project 1 State: $($p1State | ConvertTo-Json)"
  Take-Screenshot "C:\Users\Admin\daria-portfolio\vivid_test_p1.png"

  # 2. Scroll to Project 2
  Write-Output "Scrolling to Project 2..."
  Exec-JS "window.scrollToProject(1)"
  Start-Sleep -Seconds 2

  $p2State = Exec-JS @"
  (() => {
    const title = document.querySelector('.projects-titles-track .project-title.is-active');
    const client = document.querySelector('.projects-clients-track .client-badge.is-active');
    const sticky = document.querySelector('.projects-sticky-col');
    const card1 = document.querySelector('.project-card[data-project-idx=\"1\"]');
    const wrap1 = card1 ? card1.querySelector('.project-media-wrap') : null;
    return {
      scrollY: window.scrollY,
      stickyTop: sticky ? sticky.getBoundingClientRect().top : null,
      titleText: title ? title.textContent.trim() : null,
      titleOpacity: title ? window.getComputedStyle(title).opacity : null,
      clientName: client ? client.querySelector('.client-name').textContent.trim() : null,
      clientOpacity: client ? window.getComputedStyle(client).opacity : null,
      card1Active: card1 ? card1.classList.contains('is-active') : false,
      card1Opacity: wrap1 ? window.getComputedStyle(wrap1).opacity : null
    };
  })()
"@
  Write-Output "Project 2 State: $($p2State | ConvertTo-Json)"
  Take-Screenshot "C:\Users\Admin\daria-portfolio\vivid_test_p2.png"

  # 3. Scroll to Project 3
  Write-Output "Scrolling to Project 3..."
  Exec-JS "window.scrollToProject(2)"
  Start-Sleep -Seconds 2

  $p3State = Exec-JS @"
  (() => {
    const title = document.querySelector('.projects-titles-track .project-title.is-active');
    const client = document.querySelector('.projects-clients-track .client-badge.is-active');
    const sticky = document.querySelector('.projects-sticky-col');
    const card2 = document.querySelector('.project-card[data-project-idx=\"2\"]');
    const wrap2 = card2 ? card2.querySelector('.project-media-wrap') : null;
    return {
      scrollY: window.scrollY,
      stickyTop: sticky ? sticky.getBoundingClientRect().top : null,
      titleText: title ? title.textContent.trim() : null,
      titleOpacity: title ? window.getComputedStyle(title).opacity : null,
      clientName: client ? client.querySelector('.client-name').textContent.trim() : null,
      card2Active: card2 ? card2.classList.contains('is-active') : false,
      card2Opacity: wrap2 ? window.getComputedStyle(wrap2).opacity : null
    };
  })()
"@
  Write-Output "Project 3 State: $($p3State | ConvertTo-Json)"
  Take-Screenshot "C:\Users\Admin\daria-portfolio\vivid_test_p3.png"

  # 4. Scroll to Project 4
  Write-Output "Scrolling to Project 4..."
  Exec-JS "window.scrollToProject(3)"
  Start-Sleep -Seconds 2

  $p4State = Exec-JS @"
  (() => {
    const title = document.querySelector('.projects-titles-track .project-title.is-active');
    const client = document.querySelector('.projects-clients-track .client-badge.is-active');
    const sticky = document.querySelector('.projects-sticky-col');
    const card3 = document.querySelector('.project-card[data-project-idx=\"3\"]');
    const wrap3 = card3 ? card3.querySelector('.project-media-wrap') : null;
    return {
      scrollY: window.scrollY,
      stickyTop: sticky ? sticky.getBoundingClientRect().top : null,
      titleText: title ? title.textContent.trim() : null,
      titleOpacity: title ? window.getComputedStyle(title).opacity : null,
      clientName: client ? client.querySelector('.client-name').textContent.trim() : null,
      card3Active: card3 ? card3.classList.contains('is-active') : false,
      card3Opacity: wrap3 ? window.getComputedStyle(wrap3).opacity : null
    };
  })()
"@
  Write-Output "Project 4 State: $($p4State | ConvertTo-Json)"
  Take-Screenshot "C:\Users\Admin\daria-portfolio\vivid_test_p4.png"

  # 5. Check clicking ABOUT still works accurately
  Write-Output "Clicking ABOUT..."
  Exec-JS "document.querySelector('a[href=\"#about\"]').click()"
  Start-Sleep -Seconds 2

  $aboutState = Exec-JS @"
  (() => {
    const aboutTitle = document.querySelector('.about-title');
    const header = document.querySelector('.site-header');
    return {
      scrollY: window.scrollY,
      aboutTitleTop: aboutTitle ? aboutTitle.getBoundingClientRect().top : null,
      headerHeight: header ? header.offsetHeight : null
    };
  })()
"@
  Write-Output "ABOUT State: $($aboutState | ConvertTo-Json)"
  Take-Screenshot "C:\Users\Admin\daria-portfolio\vivid_test_about.png"

} finally {
  if ($ws) { $ws.Dispose() }
  Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
}
