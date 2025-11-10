# SSH Brute Force Attack Test for Windows
# This script simulates SSH brute force attack for testing threat detection

Write-Host "🚀 SSH Brute Force Attack Test (Windows)" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if OpenSSH client is available
$sshPath = Get-Command ssh -ErrorAction SilentlyContinue
if (-not $sshPath) {
    Write-Host "❌ SSH client not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install OpenSSH Client:" -ForegroundColor Yellow
    Write-Host "  1. Open Settings > Apps > Optional Features" -ForegroundColor Gray
    Write-Host "  2. Click 'Add a feature'" -ForegroundColor Gray
    Write-Host "  3. Search for 'OpenSSH Client' and install" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Or install via PowerShell (as Administrator):" -ForegroundColor Yellow
    Write-Host "  Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "✓ SSH client found: $($sshPath.Source)" -ForegroundColor Green
Write-Host ""

# Target (can be localhost if SSH server is running, or remote server)
$target = "localhost"
$fakeUser = "fakeuser_test"
$attempts = 6

Write-Host "Target: $target" -ForegroundColor Yellow
Write-Host "Attempting $attempts SSH connections with invalid credentials..." -ForegroundColor Yellow
Write-Host "Agent should detect and report after 5 attempts!" -ForegroundColor Yellow
Write-Host ""

for ($i = 1; $i -le $attempts; $i++) {
    Write-Host "[$i/$attempts] Attack attempt..." -ForegroundColor Cyan
    
    # Try SSH with fake credentials (will fail)
    # Using echo to pipe password (will fail on most SSH configs)
    $env:SSH_ASKPASS_REQUIRE = "never"
    echo "wrong_password" | ssh -o ConnectTimeout=2 -o StrictHostKeyChecking=no -o NumberOfPasswordPrompts=1 -o PreferredAuthentications=password $fakeUser@$target 2>&1 | Select-Object -First 1
    
    Start-Sleep -Seconds 1
}

Write-Host ""
Write-Host "✅ Attack simulation completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Check the SecureVault agent logs for:" -ForegroundColor Yellow
Write-Host "  → Failed login attempts detected" -ForegroundColor Gray
Write-Host "  🚨 Threat(s) detected and reported" -ForegroundColor Gray
Write-Host "  → SSH brute force attack from your IP" -ForegroundColor Gray
Write-Host ""
Write-Host "Then check the dashboard:" -ForegroundColor Yellow
Write-Host "  • Navigate to Threats page" -ForegroundColor Gray
Write-Host "  • You should see a new threat entry" -ForegroundColor Gray
Write-Host "  • Severity: HIGH or CRITICAL" -ForegroundColor Gray
Write-Host ""
Write-Host "Note: On Windows, you need SSH server running for this to work." -ForegroundColor DarkYellow
Write-Host "Alternative: You can test against a remote Linux server instead." -ForegroundColor DarkYellow
Write-Host ""
