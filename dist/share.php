<?php
/**
 * Trip Himalaya Tours & Travels - Dynamic Social Media Sharing Bridge
 * Provides rich Open Graph & Twitter Card metadata for social crawlers
 * (Facebook, Messenger, WhatsApp, Twitter/X, LinkedIn, Telegram, etc.)
 * and seamlessly redirects human visitors to the specific selected page.
 */

// Disable caching for crawler requests so metadata updates are always fresh
header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-cache, no-store, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

$productionDomain = 'https://triphimalaya.com.np';
$backendApiBase   = 'https://thtt-backend.triphimalaya.com.np/api';
$backendMediaBase = 'https://thtt-backend.triphimalaya.com.np';
$fallbackImage    = 'https://triphimalaya.com.np/Logo.png';
$siteName         = 'Trip Himalaya Tours & Travel | Nepal & International Tours, Visa, Work Permit & Travel Agency';

/**
 * Detect whether the incoming request is from a social media crawler/scraper
 */
function isSocialCrawler(): bool {
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    if (empty($userAgent)) {
        return false;
    }
    $crawlers = [
        'facebookexternalhit',
        'Facebot',
        'Twitterbot',
        'LinkedInBot',
        'WhatsApp',
        'TelegramBot',
        'Discordbot',
        'Pinterest',
        'SkypeUriPreview',
        'Slackbot',
        'vkShare',
        'redditbot',
        'Applebot',
        'bingbot',
        'Googlebot',
    ];
    foreach ($crawlers as $pattern) {
        if (stripos($userAgent, $pattern) !== false) {
            return true;
        }
    }
    return false;
}

// 1. Gather incoming parameters
$title     = isset($_GET['title']) ? trim((string)$_GET['title']) : '';
$desc      = isset($_GET['desc']) ? trim((string)$_GET['desc']) : (isset($_GET['text']) ? trim((string)$_GET['text']) : '');
$img       = isset($_GET['img']) ? trim((string)$_GET['img']) : (isset($_GET['image']) ? trim((string)$_GET['image']) : '');
$targetUrl = isset($_GET['url']) ? trim((string)$_GET['url']) : (isset($_GET['redirect']) ? trim((string)$_GET['redirect']) : '');
$type      = isset($_GET['type']) ? trim((string)$_GET['type']) : '';
$id        = isset($_GET['id']) ? trim((string)$_GET['id']) : '';

// 2. Normalize target URL (ensure absolute URL pointing to production)
if (empty($targetUrl)) {
    if (!empty($type) && !empty($id)) {
        $targetUrl = $productionDomain . '/' . ltrim($type, '/') . '/' . urlencode($id);
    } else {
        $targetUrl = $productionDomain;
    }
} else {
    // If targetUrl came from localhost, map to production
    $parsed = @parse_url($targetUrl);
    if ($parsed && isset($parsed['host']) && in_array($parsed['host'], ['localhost', '127.0.0.1'])) {
        $path = $parsed['path'] ?? '/';
        $query = isset($parsed['query']) ? '?' . $parsed['query'] : '';
        $targetUrl = $productionDomain . $path . $query;
    }
}

// 3. Fallback: If title or image are missing and type + id are supplied, fetch directly from backend API
if ((empty($title) || empty($img)) && !empty($type) && !empty($id)) {
    $ctx = stream_context_create([
        'http' => [
            'timeout' => 2.5,
            'header'  => "User-Agent: TripHimalayaShareBridge/1.0\r\nAccept: application/json\r\n",
        ],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
        ],
    ]);

    try {
        if ($type === 'visa-details') {
            $raw = @file_get_contents($backendApiBase . '/visa-categories', false, $ctx);
            if ($raw) {
                $json = json_decode($raw, true);
                $items = $json['data'] ?? [];
                foreach ($items as $item) {
                    if ((string)($item['id'] ?? '') === (string)$id) {
                        $countryName = $item['country']['country_name'] ?? 'Visa';
                        $catName = $item['name'] ?? 'Tourist Visa';
                        if (empty($title)) {
                            $title = $countryName . ' Visa – ' . $catName;
                        }
                        if (empty($desc)) {
                            $desc = $item['short_description'] ?? ("Apply for " . $countryName . " " . $catName . " with Trip Himalaya Tours & Travel.");
                        }
                        if (empty($img)) {
                            $img = $item['visa_image'] ?? ($item['image'] ?? '');
                        }
                        break;
                    }
                }
            }
        } elseif ($type === 'details') {
            $raw = @file_get_contents($backendApiBase . '/packages/' . urlencode($id), false, $ctx);
            if ($raw) {
                $json = json_decode($raw, true);
                $pkg = $json['data'] ?? $json;
                if (!empty($pkg['title']) && empty($title)) {
                    $title = $pkg['title'];
                }
                if (!empty($pkg['description']) && empty($desc)) {
                    $desc = strip_tags((string)$pkg['description']);
                    if (mb_strlen($desc) > 160) $desc = mb_substr($desc, 0, 157) . '...';
                }
                if (empty($img)) {
                    $img = $pkg['main_image'] ?? ($pkg['image'] ?? '');
                }
            }
        } elseif ($type === 'hotel-detail') {
            $raw = @file_get_contents($backendApiBase . '/hotels/show/' . urlencode($id), false, $ctx);
            if ($raw) {
                $json = json_decode($raw, true);
                $h = $json['data'] ?? $json;
                if (!empty($h['name']) && empty($title)) {
                    $title = $h['name'] . ' | Hotel Booking';
                }
                if (!empty($h['description']) && empty($desc)) {
                    $desc = strip_tags((string)$h['description']);
                }
                if (empty($img)) {
                    $img = $h['image'] ?? '';
                }
            }
        } elseif ($type === 'documents' || $type === 'documentation') {
            $raw = @file_get_contents($backendApiBase . '/documents/' . urlencode($id), false, $ctx);
            if ($raw) {
                $json = json_decode($raw, true);
                $doc = $json['data'] ?? $json;
                if (!empty($doc['title']) && empty($title)) {
                    $title = $doc['title'] . ' | Official Travel Clearance';
                }
                if (!empty($doc['description']) && empty($desc)) {
                    $desc = strip_tags((string)$doc['description']);
                }
            }
        }
    } catch (\Throwable $e) {
        // Continue with fallbacks
    }
}

// 4. Default fallbacks if still empty
if (empty($title)) {
    $title = 'Trip Himalaya Tours & Travel | Nepal & International Tours, Visa, Work Permit & Travel Agency';
}
if (empty($desc)) {
    $desc = 'Trip Himalaya Tours & Travel: Premier travel agency in Nepal for domestic & international holiday packages, flight ticketing, worldwide visa processing, overseas work permits, Himalayan trekking, and travel insurance.';
}

// 5. Normalize image URL (ensure absolute https URL and not data URI)
if (!empty($img)) {
    $img = trim($img);
    if (strpos($img, 'data:') === 0) {
        $img = $fallbackImage;
    } elseif (strpos($img, '//') === 0) {
        $img = 'https:' . $img;
    } elseif (strpos($img, '/') === 0) {
        $img = $productionDomain . $img;
    } elseif (strpos($img, 'http://') !== 0 && strpos($img, 'https://') !== 0) {
        // Check if looks like a backend uploads path
        if (strpos($img, 'uploads/') !== false || strpos($img, 'storage/') !== false) {
            $img = $backendMediaBase . '/' . ltrim($img, '/');
        } else {
            $img = $productionDomain . '/' . ltrim($img, '/');
        }
    }
} else {
    $img = $fallbackImage;
}

// 6. If request is from a human visitor (NOT a social crawler), immediately redirect to target page!
if (!isSocialCrawler()) {
    header('Location: ' . $targetUrl, true, 302);
    // Fall through to output HTML redirect below as backup for rare environments that ignore Location
}

// Full canonical URL for this share entry
$currentShareUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "https") .
    "://" . ($_SERVER['HTTP_HOST'] ?? 'triphimalaya.com.np') . ($_SERVER['REQUEST_URI'] ?? '/share.php');

$cleanTitle = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
$cleanDesc  = htmlspecialchars($desc, ENT_QUOTES, 'UTF-8');
$cleanImg   = htmlspecialchars($img, ENT_QUOTES, 'UTF-8');
$cleanTarget= htmlspecialchars($targetUrl, ENT_QUOTES, 'UTF-8');
$cleanShare = htmlspecialchars($currentShareUrl, ENT_QUOTES, 'UTF-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title><?= $cleanTitle ?></title>
  <meta name="description" content="<?= $cleanDesc ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Open Graph / Facebook / Messenger / WhatsApp / LinkedIn -->
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="<?= htmlspecialchars($siteName, ENT_QUOTES, 'UTF-8') ?>">
  <meta property="og:title" content="<?= $cleanTitle ?>">
  <meta property="og:description" content="<?= $cleanDesc ?>">
  <meta property="og:image" content="<?= $cleanImg ?>">
  <meta property="og:image:secure_url" content="<?= $cleanImg ?>">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="<?= $cleanShare ?>">

  <!-- Twitter / X Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@TripHimalaya">
  <meta name="twitter:title" content="<?= $cleanTitle ?>">
  <meta name="twitter:description" content="<?= $cleanDesc ?>">
  <meta name="twitter:image" content="<?= $cleanImg ?>">

  <link rel="canonical" href="<?= $cleanTarget ?>">

  <!-- Instant Client Redirect for human visitors -->
  <meta http-equiv="refresh" content="0;url=<?= $cleanTarget ?>">
  <script>
    window.location.replace(<?= json_encode($targetUrl, JSON_UNESCAPED_SLASHES) ?>);
  </script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #FBFBFE;
      color: #2D1347;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
      text-align: center;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      padding: 32px 24px;
      max-width: 420px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
    }
    .logo {
      height: 48px;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 18px;
      margin: 0 0 8px 0;
      color: #2D1347;
    }
    p {
      font-size: 13px;
      color: #6b7280;
      margin: 0 0 20px 0;
      line-height: 1.5;
    }
    a.btn {
      display: inline-block;
      background: #E91E63;
      color: #ffffff;
      padding: 10px 24px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: bold;
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="card">
    <img src="<?= $cleanImg ?>" alt="<?= $cleanTitle ?>" class="logo" style="height: 60px; object-fit: cover; border-radius: 8px;">
    <h1><?= $cleanTitle ?></h1>
    <p><?= $cleanDesc ?></p>
    <a href="<?= $cleanTarget ?>" class="btn">Proceed to Page</a>
  </div>
</body>
</html>
