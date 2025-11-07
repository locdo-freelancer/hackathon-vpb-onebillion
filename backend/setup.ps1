# One Billion Backend - Installation Script
# This script helps set up the backend application quickly

Write-Host "================================" -ForegroundColor Cyan
Write-Host "One Billion Backend Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "Checking npm version..." -ForegroundColor Yellow
$npmVersion = npm --version 2>$null
if ($npmVersion) {
    Write-Host "✓ npm $npmVersion found" -ForegroundColor Green
} else {
    Write-Host "✗ npm not found" -ForegroundColor Red
    exit 1
}

# Check PostgreSQL
Write-Host "Checking PostgreSQL..." -ForegroundColor Yellow
$pgVersion = psql --version 2>$null
if ($pgVersion) {
    Write-Host "✓ PostgreSQL found: $pgVersion" -ForegroundColor Green
} else {
    Write-Host "⚠ PostgreSQL not found in PATH. Please ensure PostgreSQL is installed." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Installing Backend Dependencies" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Set-Location backend

Write-Host "Running npm install..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Create .env if it doesn't exist
if (-not (Test-Path .env)) {
    Write-Host ""
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✓ .env file created from .env.example" -ForegroundColor Green
    Write-Host "⚠ Please edit backend/.env with your database credentials" -ForegroundColor Yellow
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Edit backend/.env with your database settings" -ForegroundColor White
Write-Host "2. Create database: createdb onebillion" -ForegroundColor White
Write-Host "3. Run: cd backend && npm run start:dev" -ForegroundColor White
Write-Host ""
Write-Host "For infrastructure deployment:" -ForegroundColor White
Write-Host "  cd infrastructure" -ForegroundColor White
Write-Host "  npm install" -ForegroundColor White
Write-Host "  cdk deploy --all" -ForegroundColor White
Write-Host ""
Write-Host "Documentation:" -ForegroundColor White
Write-Host "  - QUICKSTART.md - Quick setup guide" -ForegroundColor White
Write-Host "  - backend/README_BACKEND.md - Backend documentation" -ForegroundColor White
Write-Host "  - infrastructure/README.md - AWS deployment guide" -ForegroundColor White
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Cyan
