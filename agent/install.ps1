# SecureVault Agent Installer for Windows
# PowerShell Script

param(
    [Parameter(Mandatory=$true)]
    [string]$Server,
    
    [Parameter(Mandatory=$true)]
    [string]$Token
)

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  SecureVault Agent Installer v1.0.0" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python detected: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Error: Python is required but not installed" -ForegroundColor Red
    Write-Host "Please install Python from https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host "Make sure to check 'Add Python to PATH' during installation" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Installation directory
$InstallDir = "$env:USERPROFILE\.securevault"
$AgentScript = "$InstallDir\securevault-agent.py"
$ConfigFile = "$InstallDir\config.txt"

Write-Host "Installing agent to: $InstallDir" -ForegroundColor Yellow
Write-Host ""

# Create installation directory
New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null

# Copy agent script
$SourceAgent = Join-Path $PSScriptRoot "securevault-agent.py"
if (Test-Path $SourceAgent) {
    Copy-Item $SourceAgent -Destination $AgentScript -Force
} else {
    Write-Host "✗ Error: securevault-agent.py not found in current directory" -ForegroundColor Red
    Write-Host "Please run this script from the agent directory" -ForegroundColor Yellow
    exit 1
}

# Save configuration
$ConfigContent = @"
SERVER_URL=$Server
TOKEN=$Token
INSTALLED_AT=$(Get-Date)
"@
Set-Content -Path $ConfigFile -Value $ConfigContent

Write-Host "✓ Agent installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Cyan
Write-Host "  Server: $Server"
Write-Host "  Token: $($Token.Substring(0, 16))...$($Token.Substring($Token.Length - 8))"
Write-Host "  Install Dir: $InstallDir"
Write-Host ""
Write-Host "To start the agent, run:" -ForegroundColor Yellow
Write-Host "  python `"$AgentScript`" --server $Server --token $Token" -ForegroundColor White
Write-Host ""
Write-Host "Or run it in the background (as a job):" -ForegroundColor Yellow
Write-Host "  Start-Job -ScriptBlock { python `"$AgentScript`" --server $Server --token $Token }" -ForegroundColor White
Write-Host ""
Write-Host "To install as a Windows Service:" -ForegroundColor Yellow
Write-Host "  1. Install NSSM (Non-Sucking Service Manager): https://nssm.cc/download" -ForegroundColor Gray
Write-Host "  2. Run: nssm install SecureVaultAgent python `"$AgentScript`" --server $Server --token $Token" -ForegroundColor Gray
Write-Host ""
