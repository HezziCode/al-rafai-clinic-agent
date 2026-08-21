$genPath = "C:\Users\HP\.gemini\antigravity\brain\6530a071-59f8-4a90-9cbd-ef85fc97c9bc\clinic_favicon_1787311281689.jpg"
$publicDir = "D:\projects\project-one\clinic-booking-agent\frontend\public"
$appDir = "D:\projects\project-one\clinic-booking-agent\frontend\app"

if (!(Test-Path $publicDir)) {
    New-Item -ItemType Directory -Force -Path $publicDir | Out-Null
}

Copy-Item $genPath -Destination "$publicDir\favicon.ico" -Force
Copy-Item $genPath -Destination "$publicDir\icon.jpg" -Force
Copy-Item $genPath -Destination "$publicDir\icon.png" -Force
Copy-Item $genPath -Destination "$appDir\favicon.ico" -Force
Copy-Item $genPath -Destination "$appDir\icon.jpg" -Force

Write-Host "Favicons set up successfully in public and app directories!"
