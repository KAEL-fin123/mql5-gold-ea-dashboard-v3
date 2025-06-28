# MQL5 GOLD EA Dashboard - NPM Installation Fix Script
# 解决 Node.js v22 与 npm install 的兼容性问题

Write-Host "🔧 MQL5 GOLD EA Dashboard - NPM 安装修复脚本" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# 检查当前目录
$currentDir = Get-Location
Write-Host "📁 当前目录: $currentDir" -ForegroundColor Yellow

# 检查 Node.js 版本
Write-Host "`n🔍 检查 Node.js 版本..." -ForegroundColor Green
node --version
npm --version

# 步骤 1: 清理现有文件
Write-Host "`n🧹 步骤 1: 清理现有包管理器文件..." -ForegroundColor Green

if (Test-Path "node_modules") {
    Write-Host "  删除 node_modules 目录..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    Write-Host "  ✅ node_modules 已删除" -ForegroundColor Green
} else {
    Write-Host "  ℹ️  node_modules 不存在" -ForegroundColor Gray
}

if (Test-Path "pnpm-lock.yaml") {
    Write-Host "  删除 pnpm-lock.yaml..." -ForegroundColor Yellow
    Remove-Item pnpm-lock.yaml -ErrorAction SilentlyContinue
    Write-Host "  ✅ pnpm-lock.yaml 已删除" -ForegroundColor Green
} else {
    Write-Host "  ℹ️  pnpm-lock.yaml 不存在" -ForegroundColor Gray
}

if (Test-Path "package-lock.json") {
    Write-Host "  删除 package-lock.json..." -ForegroundColor Yellow
    Remove-Item package-lock.json -ErrorAction SilentlyContinue
    Write-Host "  ✅ package-lock.json 已删除" -ForegroundColor Green
} else {
    Write-Host "  ℹ️  package-lock.json 不存在" -ForegroundColor Gray
}

# 步骤 2: 清理 npm 缓存
Write-Host "`n🗑️  步骤 2: 清理 npm 缓存..." -ForegroundColor Green
npm cache clean --force
Write-Host "  ✅ npm 缓存已清理" -ForegroundColor Green

# 步骤 3: 检查 package.json
Write-Host "`n📋 步骤 3: 验证 package.json..." -ForegroundColor Green
if (Test-Path "package.json") {
    Write-Host "  ✅ package.json 存在" -ForegroundColor Green
    
    # 显示关键依赖
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    Write-Host "  📦 项目名称: $($packageJson.name)" -ForegroundColor Cyan
    Write-Host "  📦 版本: $($packageJson.version)" -ForegroundColor Cyan
    
    # 检查是否包含 dotenv
    if ($packageJson.devDependencies.dotenv) {
        Write-Host "  ✅ dotenv 依赖已添加" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  dotenv 依赖缺失" -ForegroundColor Red
    }
} else {
    Write-Host "  ❌ package.json 不存在!" -ForegroundColor Red
    exit 1
}

# 步骤 4: 尝试安装依赖
Write-Host "`n📦 步骤 4: 安装项目依赖..." -ForegroundColor Green
Write-Host "  正在运行 npm install..." -ForegroundColor Yellow

try {
    npm install
    Write-Host "  ✅ 依赖安装成功!" -ForegroundColor Green
    
    # 验证关键包
    Write-Host "`n🔍 验证关键依赖..." -ForegroundColor Green
    
    $packages = @("@supabase/supabase-js", "next", "react", "dotenv")
    foreach ($package in $packages) {
        if (Test-Path "node_modules\$package") {
            Write-Host "  ✅ $package" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $package" -ForegroundColor Red
        }
    }
    
} catch {
    Write-Host "  ❌ npm install 失败!" -ForegroundColor Red
    Write-Host "  错误信息: $($_.Exception.Message)" -ForegroundColor Red
    
    Write-Host "`n🔄 尝试替代方案..." -ForegroundColor Yellow
    Write-Host "  建议使用 pnpm 或 yarn:" -ForegroundColor Cyan
    Write-Host "  pnpm install" -ForegroundColor Gray
    Write-Host "  或者" -ForegroundColor Gray
    Write-Host "  yarn install" -ForegroundColor Gray
    exit 1
}

# 步骤 5: 测试数据库连接
Write-Host "`n🔗 步骤 5: 测试数据库连接..." -ForegroundColor Green
if (Test-Path "scripts\test-db.js") {
    Write-Host "  运行数据库测试..." -ForegroundColor Yellow
    npm run db:test
} else {
    Write-Host "  ⚠️  数据库测试脚本不存在" -ForegroundColor Yellow
}

Write-Host "`n🎉 修复完成!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "下一步:" -ForegroundColor Cyan
Write-Host "1. 运行 npm run dev 启动开发服务器" -ForegroundColor White
Write-Host "2. 运行 npm run db:test 测试数据库连接" -ForegroundColor White
Write-Host "3. 访问 http://localhost:3000 查看项目" -ForegroundColor White
