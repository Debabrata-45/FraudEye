# FraudEye Demo Transaction Seeder
# Usage: .\infra\seed_transactions.ps1

$base = "http://localhost:4000"

# Login
$response = Invoke-RestMethod -Uri "$base/api/auth/login" -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"analyst@fraudeye.com","password":"Analyst@12345"}'
$token = $response.data.token
Write-Host "✅ Logged in as analyst"

$headers = @{Authorization = "Bearer $token"}

# Safe transactions
$safeTransactions = @(
  @{transactionId="seed_safe_001";userId="user_101";merchantId="merch_001";amount=450;currency="INR";deviceId="device_trusted_101";ipAddress="192.168.1.101";geoLat=28.6139;geoLng=77.2090;occurredAt="2026-03-09T10:00:00Z"},
  @{transactionId="seed_safe_002";userId="user_102";merchantId="merch_002";amount=1200;currency="INR";deviceId="device_trusted_102";ipAddress="192.168.1.102";geoLat=19.0760;geoLng=72.8777;occurredAt="2026-03-09T10:05:00Z"},
  @{transactionId="seed_safe_003";userId="user_103";merchantId="merch_003";amount=320;currency="INR";deviceId="device_trusted_103";ipAddress="192.168.1.103";geoLat=12.9716;geoLng=77.5946;occurredAt="2026-03-09T10:10:00Z"},
  @{transactionId="seed_safe_004";userId="user_104";merchantId="merch_001";amount=890;currency="INR";deviceId="device_trusted_104";ipAddress="10.0.0.10";geoLat=22.5726;geoLng=88.3639;occurredAt="2026-03-09T10:15:00Z"},
  @{transactionId="seed_safe_005";userId="user_105";merchantId="merch_002";amount=2100;currency="INR";deviceId="device_trusted_105";ipAddress="10.0.0.11";geoLat=13.0827;geoLng=80.2707;occurredAt="2026-03-09T10:20:00Z"}
)

# Fraud transactions (unusual hour, high amount, suspicious IP, new device)
$fraudTransactions = @(
  @{transactionId="seed_fraud_001";userId="user_201";merchantId="merch_005";amount=95000;currency="INR";deviceId="device_hacked_201";ipAddress="185.220.101.5";geoLat=55.7558;geoLng=37.6173;occurredAt="2026-03-09T02:00:00Z"},
  @{transactionId="seed_fraud_002";userId="user_202";merchantId="merch_005";amount=78000;currency="INR";deviceId="device_hacked_202";ipAddress="91.108.4.1";geoLat=40.7128;geoLng=-74.0060;occurredAt="2026-03-09T03:15:00Z"},
  @{transactionId="seed_fraud_003";userId="user_203";merchantId="merch_004";amount=120000;currency="INR";deviceId="device_hacked_203";ipAddress="194.165.16.5";geoLat=51.5074;geoLng=-0.1278;occurredAt="2026-03-09T01:30:00Z"},
  @{transactionId="seed_fraud_004";userId="user_204";merchantId="merch_005";amount=55000;currency="INR";deviceId="device_hacked_204";ipAddress="185.220.101.9";geoLat=35.6762;geoLng=139.6503;occurredAt="2026-03-09T04:00:00Z"},
  @{transactionId="seed_fraud_005";userId="user_205";merchantId="merch_004";amount=88000;currency="INR";deviceId="device_hacked_205";ipAddress="91.108.56.1";geoLat=48.8566;geoLng=2.3522;occurredAt="2026-03-09T02:45:00Z"}
)

$all = $safeTransactions + $fraudTransactions
$count = 0

foreach ($txn in $all) {
  try {
    $body = $txn | ConvertTo-Json
    Invoke-RestMethod -Uri "$base/api/transactions" -Method POST `
      -ContentType "application/json" `
      -Headers $headers `
      -Body $body | Out-Null
    $count++
    Write-Host "✅ Sent: $($txn.transactionId)"
    Start-Sleep -Milliseconds 200
  } catch {
    Write-Host "❌ Failed: $($txn.transactionId) — $_"
  }
}

Write-Host "`n🎉 Seeded $count transactions! Check dashboard at http://localhost:5173"