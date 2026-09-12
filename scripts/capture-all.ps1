$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$outDir = 'C:\Users\vishn\.gemini\antigravity-ide\brain\19761be4-4367-4045-b3de-963952be60ad\screenshots'

$targets = @(
  @{ name = '01_home'; url = 'http://localhost:3000'; w = 1280; h = 1000 },
  @{ name = '02_explore'; url = 'http://localhost:3000/explore'; w = 1280; h = 1000 },
  @{ name = '03_place_charminar'; url = 'http://localhost:3000/places/charminar'; w = 1280; h = 1000 },
  @{ name = '04_experiences'; url = 'http://localhost:3000/experiences'; w = 1280; h = 1000 },
  @{ name = '05_food'; url = 'http://localhost:3000/food'; w = 1280; h = 1000 },
  @{ name = '06_find_my_yatra'; url = 'http://localhost:3000/find-my-yatra'; w = 1280; h = 1000 },
  @{ name = '07_mitras'; url = 'http://localhost:3000/mitras'; w = 1280; h = 1000 },
  @{ name = '08_booking'; url = 'http://localhost:3000/booking?placeId=charminar'; w = 1280; h = 1000 },
  @{ name = '09_dashboard'; url = 'http://localhost:3000/dashboard'; w = 1280; h = 1000 },
  @{ name = '10_trip'; url = 'http://localhost:3000/trip'; w = 1280; h = 1000 },
  @{ name = '11_safety'; url = 'http://localhost:3000/safety'; w = 1280; h = 1000 },
  @{ name = '12_login'; url = 'http://localhost:3000/login'; w = 1280; h = 1000 },
  @{ name = '13_signup'; url = 'http://localhost:3000/signup'; w = 1280; h = 1000 },
  @{ name = '14_how_it_works'; url = 'http://localhost:3000/how-it-works'; w = 1280; h = 1000 },
  @{ name = '15_become_mitra'; url = 'http://localhost:3000/become-mitra'; w = 1280; h = 1000 },
  @{ name = '16_mobile_home'; url = 'http://localhost:3000'; w = 375; h = 667 },
  @{ name = '17_mobile_explore'; url = 'http://localhost:3000/explore'; w = 375; h = 667 },
  @{ name = '18_mobile_place'; url = 'http://localhost:3000/places/charminar'; w = 375; h = 667 }
)

foreach ($t in $targets) {
  $file = "$outDir\$($t.name).png"
  Write-Host "Capturing $($t.name) from $($t.url) ($($t.w)x$($t.h))..."
  $args = @(
    '--headless=new',
    '--disable-gpu',
    "--window-size=$($t.w),$($t.h)",
    "--screenshot=$file",
    '--virtual-time-budget=2000',
    $t.url
  )
  Start-Process -FilePath $chrome -ArgumentList $args -Wait
  if (Test-Path $file) {
    $size = (Get-Item $file).Length
    Write-Host "  -> Done ($size bytes)"
  } else {
    Write-Host "  -> Failed to generate $file"
  }
}

Write-Host "Batch capture completed."
