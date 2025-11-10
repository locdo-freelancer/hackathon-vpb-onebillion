# Mock SSH Attack - Generate Fake Threat for Testing
# This script sends simulated threat data directly to the backend API

param(
    [string]$ServerUrl = "http://localhost:3001",
    [string]$Token = ""
)

if (-not $Token) {
    Write-Host "❌ Error: Token is required!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Usage: .\attack-mock.ps1 -Token YOUR_AGENT_TOKEN" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Example:" -ForegroundColor Gray
    Write-Host "  .\attack-mock.ps1 -Token 391cfa7a6cf3c00c75d23e66a18e32b8bfcf95432e5f6a6b18527088b2147432" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "🎭 Mock SSH Brute Force Attack Test" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server: $ServerUrl" -ForegroundColor Yellow
Write-Host "Token: $($Token.Substring(0, 16))...$($Token.Substring($Token.Length - 8))" -ForegroundColor Yellow
Write-Host ""

# Generate realistic attacker IPs
$attackerIPs = @(
    "203.0.113.42",      # Example IP 1
    "198.51.100.88",     # Example IP 2
    "192.0.2.156",       # Example IP 3
    "45.76.123.45",      # Fake attacker
    "185.220.101.67"     # Fake attacker
)

$totalThreats = 5
$successCount = 0

Write-Host "Generating $totalThreats simulated threats..." -ForegroundColor Cyan
Write-Host ""

for ($i = 0; $i -lt $totalThreats; $i++) {
    $ip = $attackerIPs[$i]
    $attempts = Get-Random -Minimum 5 -Maximum 25
    $severity = if ($attempts -gt 15) { "high" } elseif ($attempts -gt 10) { "medium" } else { "low" }
    
    $threat = @{
        indicator = $ip
        type = "ip"
        severity = $severity
        description = "SSH brute force attack detected from $ip. $attempts failed login attempts for users: root, admin, test, user"
        confidence = [Math]::Min(95, 50 + $attempts * 3)
        tags = @("ssh", "brute-force", "failed-login", "windows-test")
        raw_logs = @(
            "Failed password for invalid user root from $ip port 58392 ssh2",
            "Failed password for invalid user admin from $ip port 58393 ssh2",
            "Failed password for invalid user test from $ip port 58394 ssh2"
        )
        metadata = @{
            failed_attempts = $attempts
            usernames = @("root", "admin", "test", "user")
            protocol = "ssh"
            port = 22
            test_data = $true
        }
    } | ConvertTo-Json -Depth 10

    Write-Host "[$($i+1)/$totalThreats] Sending threat from $ip..." -ForegroundColor Yellow
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
            "Authorization" = "Bearer $Token"
        }
        
        $response = Invoke-RestMethod -Uri "$ServerUrl/api/agent/report-threat" `
            -Method Post `
            -Headers $headers `
            -Body $threat `
            -TimeoutSec 10
        
        if ($response.success) {
            $status = if ($response.is_new) { "🆕 NEW" } else { "🔄 UPDATED" }
            Write-Host "  $status - Threat reported: $ip (Severity: $severity, Attempts: $attempts)" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "  ✗ Failed: $($response.message)" -ForegroundColor Red
        }
    } catch {
        Write-Host "  ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "✅ Mock attack completed!" -ForegroundColor Green
Write-Host "   Successfully reported: $successCount/$totalThreats threats" -ForegroundColor Green
Write-Host ""
Write-Host "Check your dashboard:" -ForegroundColor Yellow
Write-Host "  → Navigate to Threats page" -ForegroundColor Gray
Write-Host "  → You should see $successCount new threat entries" -ForegroundColor Gray
Write-Host "  → Filter by tags: ssh, brute-force" -ForegroundColor Gray
Write-Host ""
