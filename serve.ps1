param(
  [int]$Port = 0,
  [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'
$root = Join-Path $PSScriptRoot 'site'
if (-not (Test-Path -LiteralPath (Join-Path $root 'index.html'))) {
  Write-Host '未找到 site\index.html，演示包不完整，请重新复制整个文件夹。' -ForegroundColor Red
  Read-Host '按回车退出'
  exit 1
}
$rootFull = [System.IO.Path]::GetFullPath($root).TrimEnd('\') + '\'

$mime = @{
  '.html' = 'text/html; charset=utf-8'
  '.htm'  = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'text/javascript; charset=utf-8'
  '.mjs'  = 'text/javascript; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'
  '.svg'  = 'image/svg+xml'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.webp' = 'image/webp'
  '.avif' = 'image/avif'
  '.gif'  = 'image/gif'
  '.ico'  = 'image/x-icon'
  '.woff' = 'font/woff'
  '.woff2'= 'font/woff2'
  '.ttf'  = 'font/ttf'
  '.otf'  = 'font/otf'
  '.glb'  = 'model/gltf-binary'
  '.gltf' = 'model/gltf+json'
  '.mp4'  = 'video/mp4'
  '.webm' = 'video/webm'
  '.txt'  = 'text/plain; charset=utf-8'
  '.md'   = 'text/plain; charset=utf-8'
  '.xml'  = 'application/xml; charset=utf-8'
  '.pdf'  = 'application/pdf'
  '.webmanifest' = 'application/manifest+json'
}

if ($Port -gt 0) { $ports = @($Port) } else { $ports = 8090..8100 }

$listener = $null
$activePort = 0
foreach ($p in $ports) {
  $candidate = $null
  try {
    $candidate = New-Object System.Net.HttpListener
    $candidate.Prefixes.Add("http://127.0.0.1:$p/")
    $candidate.Start()
    $listener = $candidate
    $activePort = $p
    break
  } catch {
    if ($candidate) {
      try { $candidate.Close() } catch { }
    }
    $candidate = $null
    $listener = $null
  }
}

if (-not $listener) {
  Write-Host '端口 8090-8100 均被占用，无法启动。请关闭占用端口的程序后重试。' -ForegroundColor Red
  Read-Host '按回车退出'
  exit 1
}

$url = "http://127.0.0.1:$activePort/"
Write-Host ''
Write-Host '  MineForge · 采矿方法三维教学演示（离线版）' -ForegroundColor Cyan
Write-Host "  已启动：$url"
Write-Host '  保持本窗口开启；关闭窗口即停止服务。'
Write-Host ''

if (-not $NoBrowser) {
  try { Start-Process -FilePath $url } catch { Write-Host '浏览器未能自动打开，请手动复制上面的地址访问。' }
}

while ($listener.IsListening) {
  $context = $null
  try {
    $context = $listener.GetContext()
  } catch {
    break
  }

  $req = $context.Request
  $res = $context.Response
  $method = $req.HttpMethod

  try {
    $res.Headers['X-Content-Type-Options'] = 'nosniff'
    $res.Headers['Cache-Control'] = 'no-cache'

    if ($method -ne 'GET' -and $method -ne 'HEAD') {
      $body = [System.Text.Encoding]::UTF8.GetBytes('405 Method Not Allowed')
      $res.StatusCode = 405
      $res.ContentType = 'text/plain; charset=utf-8'
      $res.ContentLength64 = $body.Length
      if ($method -ne 'HEAD') { $res.OutputStream.Write($body, 0, $body.Length) }
    } else {
      $rel = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath)
      $rel = $rel.TrimStart('/')
      if ([string]::IsNullOrWhiteSpace($rel)) { $rel = 'index.html' }
      $rel = $rel.Replace('/', [System.IO.Path]::DirectorySeparatorChar)

      $full = [System.IO.Path]::GetFullPath((Join-Path $root $rel))
      $inside = $full.StartsWith($rootFull, [System.StringComparison]::OrdinalIgnoreCase)

      if (-not $inside) {
        $body = [System.Text.Encoding]::UTF8.GetBytes('403 Forbidden')
        $res.StatusCode = 403
        $res.ContentType = 'text/plain; charset=utf-8'
        $res.ContentLength64 = $body.Length
        if ($method -ne 'HEAD') { $res.OutputStream.Write($body, 0, $body.Length) }
      } else {
        if (Test-Path -LiteralPath $full -PathType Container) {
          $full = Join-Path $full 'index.html'
        }
        if (-not (Test-Path -LiteralPath $full -PathType Leaf)) {
          if ([System.IO.Path]::GetExtension($full) -eq '') {
            $candidate = Join-Path $full 'index.html'
            if (Test-Path -LiteralPath $candidate -PathType Leaf) { $full = $candidate }
          }
        }

        if (-not (Test-Path -LiteralPath $full -PathType Leaf)) {
          $body = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found')
          $res.StatusCode = 404
          $res.ContentType = 'text/plain; charset=utf-8'
          $res.ContentLength64 = $body.Length
          if ($method -ne 'HEAD') { $res.OutputStream.Write($body, 0, $body.Length) }
        } else {
          $ext = [System.IO.Path]::GetExtension($full).ToLowerInvariant()
          $type = $mime[$ext]
          if (-not $type) { $type = 'application/octet-stream' }
          $bytes = [System.IO.File]::ReadAllBytes($full)
          $res.StatusCode = 200
          $res.ContentType = $type
          $res.ContentLength64 = $bytes.Length
          if ($method -ne 'HEAD') { $res.OutputStream.Write($bytes, 0, $bytes.Length) }
        }
      }
    }
  } catch {
    try {
      $body = [System.Text.Encoding]::UTF8.GetBytes('500 Internal Server Error')
      $res.StatusCode = 500
      $res.ContentType = 'text/plain; charset=utf-8'
      $res.ContentLength64 = $body.Length
      if ($method -ne 'HEAD') { $res.OutputStream.Write($body, 0, $body.Length) }
    } catch { }
  } finally {
    try { $res.OutputStream.Close() } catch { }
    try { $res.Close() } catch { }
  }
}

try { $listener.Stop() } catch { }
try { $listener.Close() } catch { }
