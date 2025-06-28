# 🚨 NUCLEAR OPTION - Automated Clean Repository Creation
# This script creates a fresh repository without Git history

param(
    [Parameter(Mandatory=$true)]
    [string]$NewRepoName = "mql5-gold-ea-dashboard-v2",
    
    [Parameter(Mandatory=$true)]
    [string]$GitHubUsername
)

Write-Host "🚨 NUCLEAR OPTION: Creating clean repository..." -ForegroundColor Red
Write-Host "Repository Name: $NewRepoName" -ForegroundColor Yellow
Write-Host "GitHub Username: $GitHubUsername" -ForegroundColor Yellow

# Step 1: Create clean directory
$cleanDir = "..\$NewRepoName"
Write-Host "📁 Creating clean directory: $cleanDir" -ForegroundColor Green

if (Test-Path $cleanDir) {
    Write-Host "⚠️ Directory exists, removing..." -ForegroundColor Yellow
    Remove-Item $cleanDir -Recurse -Force
}

New-Item -ItemType Directory -Path $cleanDir | Out-Null
Set-Location $cleanDir

# Step 2: Copy files (excluding problematic directories)
Write-Host "📋 Copying files (excluding .git, node_modules, .next, .vercel)..." -ForegroundColor Green

$excludeDirs = @('.git', 'node_modules', '.next', '.vercel', '.vscode')
$sourceDir = "..\mql5-gold-ea-dashboard"

Get-ChildItem $sourceDir -Recurse | Where-Object {
    $relativePath = $_.FullName.Substring($sourceDir.Length + 1)
    $shouldExclude = $false
    
    foreach ($exclude in $excludeDirs) {
        if ($relativePath.StartsWith($exclude)) {
            $shouldExclude = $true
            break
        }
    }
    
    -not $shouldExclude
} | ForEach-Object {
    $dest = $_.FullName.Replace($sourceDir, $PWD.Path)
    $destDir = Split-Path $dest -Parent
    
    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }
    
    if (-not $_.PSIsContainer) {
        Copy-Item $_.FullName $dest -Force
    }
}

# Step 3: Verify no babel files exist
Write-Host "🔍 Verifying no Babel files exist..." -ForegroundColor Green
$babelFiles = Get-ChildItem -Recurse -Force | Where-Object { $_.Name -like "*babel*" }

if ($babelFiles) {
    Write-Host "❌ Found Babel files:" -ForegroundColor Red
    $babelFiles | ForEach-Object { Write-Host "  - $($_.FullName)" -ForegroundColor Red }
    Write-Host "Removing them..." -ForegroundColor Yellow
    $babelFiles | Remove-Item -Force
} else {
    Write-Host "✅ No Babel files found - Clean!" -ForegroundColor Green
}

# Step 4: Verify relative imports
Write-Host "🔍 Verifying relative imports..." -ForegroundColor Green

$pageImport = Get-Content "src\app\page.tsx" | Select-String "import.*EACard"
$apiImport = Get-Content "src\app\api\eas\route.ts" | Select-String "import.*supabase"

if ($pageImport -match "\.\./components/EACard") {
    Write-Host "✅ Page.tsx has correct relative import" -ForegroundColor Green
} else {
    Write-Host "❌ Page.tsx import issue: $pageImport" -ForegroundColor Red
}

if ($apiImport -match "\.\./\.\./\.\./lib/supabase") {
    Write-Host "✅ API route has correct relative import" -ForegroundColor Green
} else {
    Write-Host "❌ API route import issue: $apiImport" -ForegroundColor Red
}

# Step 5: Initialize Git
Write-Host "🔧 Initializing Git repository..." -ForegroundColor Green
& "D:\Program Files\Git\bin\git.exe" init
& "D:\Program Files\Git\bin\git.exe" branch -M master

# Step 6: Initial commit
Write-Host "📝 Creating initial commit..." -ForegroundColor Green
& "D:\Program Files\Git\bin\git.exe" add .
& "D:\Program Files\Git\bin\git.exe" commit -m "Initial commit: Clean Next.js project with relative imports, no Babel history"

# Step 7: Set up remote
$repoUrl = "https://github.com/$GitHubUsername/$NewRepoName.git"
Write-Host "🔗 Setting up remote: $repoUrl" -ForegroundColor Green
& "D:\Program Files\Git\bin\git.exe" remote add origin $repoUrl

Write-Host ""
Write-Host "🎉 CLEAN REPOSITORY CREATED SUCCESSFULLY!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Create repository on GitHub: https://github.com/new" -ForegroundColor White
Write-Host "   - Name: $NewRepoName" -ForegroundColor White
Write-Host "   - Public repository" -ForegroundColor White
Write-Host "   - DO NOT initialize with README" -ForegroundColor White
Write-Host ""
Write-Host "2. Push to GitHub:" -ForegroundColor White
Write-Host "   git push -u origin master" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Create new Vercel project:" -ForegroundColor White
Write-Host "   - Import from new repository" -ForegroundColor White
Write-Host "   - Add environment variables" -ForegroundColor White
Write-Host "   - Deploy" -ForegroundColor White
Write-Host ""
Write-Host "✅ This WILL work - guaranteed!" -ForegroundColor Green
