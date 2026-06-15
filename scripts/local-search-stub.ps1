param(
  [int]$Port = 65080,
  [string]$Nacos = "http://127.0.0.1:8848",
  [string]$Namespace = "dev402",
  [string]$Group = "xuecheng-plus-project"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$outDir = Join-Path $root "logs"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$indexFile = Join-Path $outDir "search-index-course-publish.jsonl"

$ip = "127.0.0.1"

$registerBody = @{
  namespaceId = $Namespace
  groupName = $Group
  serviceName = "search"
  ip = $ip
  port = $Port
  healthy = "true"
  enabled = "true"
  ephemeral = "true"
}
Invoke-WebRequest -UseBasicParsing -Method Post "$Nacos/nacos/v1/ns/instance" -Body $registerBody | Out-Null

$heartbeatScript = {
  param($Nacos, $Namespace, $Group, $Ip, $Port)
  while ($true) {
    try {
      $beat = @{
        ip = $Ip
        port = $Port
        serviceName = $Group + "@@search"
        cluster = "DEFAULT"
        weight = 1.0
      } | ConvertTo-Json -Compress
      Invoke-WebRequest -UseBasicParsing -Method Put "$Nacos/nacos/v1/ns/instance/beat" -Body @{
        namespaceId = $Namespace
        serviceName = "search"
        groupName = $Group
        ip = $Ip
        port = $Port
        beat = $beat
      } | Out-Null
    } catch {
    }
    Start-Sleep -Seconds 5
  }
}
Start-Job -ScriptBlock $heartbeatScript -ArgumentList $Nacos, $Namespace, $Group, $ip, $Port | Out-Null

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
$listener.Start()
Write-Host "local search stub listening on $Port and registered $ip`:$Port"

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  try {
    $req = $ctx.Request
    $res = $ctx.Response
    $res.ContentType = "application/json;charset=utf-8"

    if ($req.HttpMethod -eq "POST" -and $req.Url.AbsolutePath -eq "/search/index/course") {
      $reader = [System.IO.StreamReader]::new($req.InputStream, $req.ContentEncoding)
      $body = $reader.ReadToEnd()
      $reader.Close()
      Add-Content -Path $indexFile -Encoding UTF8 -Value $body
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("true")
      $res.StatusCode = 200
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } elseif ($req.Url.AbsolutePath -eq "/search/actuator/health" -or $req.Url.AbsolutePath -eq "/actuator/health") {
      $bytes = [System.Text.Encoding]::UTF8.GetBytes('{"status":"UP"}')
      $res.StatusCode = 200
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $bytes = [System.Text.Encoding]::UTF8.GetBytes('{"error":"not found"}')
      $res.StatusCode = 404
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    }
  } catch {
    try { $ctx.Response.StatusCode = 500 } catch {}
  } finally {
    try { $ctx.Response.Close() } catch {}
  }
}
