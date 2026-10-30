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
$siteName         = 'Trip Himalaya Tours and Travels Pvt. Ltd. | Nepal Tours, Treks & Visas - Airport, Kathmandu';

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
        'DuckDuckBot',
        'YandexBot',
        'Baiduspider',
        'Sogou',
        'ia_archiver',
    ];
    foreach ($crawlers as $pattern) {
        if (stripos($userAgent, $pattern) !== false) {
            return true;
        }
    }
    return false;
}

function getPermitTypeLabel(string $type): string {
    $norm = strtoupper(trim($type));
    switch ($norm) {
        case 'NEW_LABOUR_PERMIT':
        case 'NEW':
            return 'New Work Permit';
        case 'RENEWAL_PERMIT':
        case 'RENEW':
            return 'Renewal Permit';
        case 'INDIVIDUAL_PERMIT':
        case 'INDIVIDUAL':
            return 'Individual Permit';
        case 'LEGALIZATION_ATTESTATION':
        case 'LEGALIZATION':
            return 'Legalization / Attestation';
        default:
            return !empty($norm) ? ucwords(strtolower(str_replace('_', ' ', $norm))) : 'Work Permit';
    }
}

// 1. Gather incoming parameters
$title      = isset($_GET['title']) ? trim((string)$_GET['title']) : '';
$desc       = isset($_GET['desc']) ? trim((string)$_GET['desc']) : (isset($_GET['text']) ? trim((string)$_GET['text']) : '');
$img        = isset($_GET['img']) ? trim((string)$_GET['img']) : (isset($_GET['image']) ? trim((string)$_GET['image']) : '');
$targetUrl  = isset($_GET['url']) ? trim((string)$_GET['url']) : (isset($_GET['redirect']) ? trim((string)$_GET['redirect']) : '');
$type       = isset($_GET['type']) ? trim((string)$_GET['type']) : '';
$id         = isset($_GET['id']) ? trim((string)$_GET['id']) : '';
$permitType = isset($_GET['permitType']) ? trim((string)$_GET['permitType']) : '';

// Also inspect targetUrl query string if permitType not in GET
if (empty($permitType) && !empty($targetUrl)) {
    $parsedTargetQuery = @parse_url($targetUrl, PHP_URL_QUERY);
    if ($parsedTargetQuery) {
        parse_str($parsedTargetQuery, $targetQp);
        if (!empty($targetQp['permitType'])) {
            $permitType = trim((string)$targetQp['permitType']);
        }
    }
}

// 2. Normalize target URL (ensure absolute URL pointing to production)
if (empty($targetUrl)) {
    if (!empty($type) && !empty($id)) {
        // Map legacy/server route aliases to canonical React client routes
        $canonicalType = $type;
        if ($type === 'hotel-detail') $canonicalType = 'hotel-details';
        if ($type === 'vehicle-detail') $canonicalType = 'vehicle-details';
        if ($type === 'work-permit-details') $canonicalType = 'permit-details';
        if ($type === 'packages') $canonicalType = 'details';
        if ($type === 'video' || $type === 'vlog' || $type === 'vlogs') $canonicalType = 'watch';
        if ($type === 'documents') $canonicalType = 'documentation';
        if ($type === 'blog-details') $canonicalType = 'blog';
        if ($type === 'insurance-detail') $canonicalType = 'insurance-details';

        $querySuffix = !empty($permitType) ? ('?permitType=' . urlencode($permitType)) : '';
        if ($type === 'heli-services' || $type === 'heli') {
            $targetUrl = $productionDomain . '/service/heli-services/' . urlencode($id);
        } else {
            $targetUrl = $productionDomain . '/' . ltrim($canonicalType, '/') . '/' . urlencode($id) . $querySuffix;
        }
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
        } elseif ($type === 'details' || $type === 'packages') {
            $raw = @file_get_contents($backendApiBase . '/packages/' . urlencode($id), false, $ctx);
            if ($raw) {
                $json = json_decode($raw, true);
                $pkg = $json['data'] ?? $json;
                if (!empty($pkg['title']) && empty($title)) {
                    $title = $pkg['title'] . ' | Trip Himalaya Tours & Travel';
                }
                if (!empty($pkg['description']) && empty($desc)) {
                    $desc = strip_tags((string)$pkg['description']);
                    if (mb_strlen($desc) > 160) $desc = mb_substr($desc, 0, 157) . '...';
                }
                if (empty($img)) {
                    $img = $pkg['main_image'] ?? ($pkg['image'] ?? '');
                }
            }
            if (empty($title)) {
                $title = 'Himalayan Trekking & Holiday Tour Packages | Trip Himalaya';
            }
            if (empty($desc)) {
                $desc = 'Explore world-class trekking routes, Everest & Annapurna adventures, and curated international holidays with Trip Himalaya Tours & Travels.';
            }
            if (empty($img)) {
                $img = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200';
            }
        } elseif ($type === 'hotel-detail' || $type === 'hotel-details') {
            $raw = @file_get_contents($backendApiBase . '/hotels/show/' . urlencode($id), false, $ctx);
            if ($raw) {
                $json = json_decode($raw, true);
                $h = $json['data'] ?? $json;
                if (!empty($h['name']) && empty($title)) {
                    $title = $h['name'] . ' | Luxury Hotel Booking';
                }
                if (!empty($h['description']) && empty($desc)) {
                    $desc = strip_tags((string)$h['description']);
                    if (mb_strlen($desc) > 160) $desc = mb_substr($desc, 0, 157) . '...';
                }
                if (empty($img)) {
                    $img = $h['image'] ?? '';
                }
            }
            if (empty($title)) {
                $title = 'Luxury Hotel & Resort Booking in Nepal | Trip Himalaya';
            }
            if (empty($desc)) {
                $desc = 'Book top-rated hotels, boutique resorts, and heritage stays in Kathmandu, Pokhara, Chitwan, and beyond with Trip Himalaya.';
            }
            if (empty($img)) {
                $img = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200';
            }
        } elseif ($type === 'vehicle-detail' || $type === 'vehicle-details') {
            $raw = @file_get_contents($backendApiBase . '/vehicles/' . urlencode($id), false, $ctx);
            if ($raw) {
                $json = json_decode($raw, true);
                $veh = $json['data'] ?? $json;
                if (!empty($veh['name']) && empty($title)) {
                    $title = $veh['name'] . ' Rental | Trip Himalaya';
                }
                if (!empty($veh['description']) && empty($desc)) {
                    $desc = strip_tags((string)$veh['description']);
                    if (mb_strlen($desc) > 160) $desc = mb_substr($desc, 0, 157) . '...';
                }
                if (empty($img)) {
                    $img = $veh['image'] ?? ($veh['vehicle_image'] ?? '');
                }
            }
            if (empty($title)) {
                $title = 'Vehicle Rental & Private Fleet Hire in Nepal | Trip Himalaya';
            }
            if (empty($desc)) {
                $desc = 'Rent comfortable cars, 4WD Scorpio jeeps, HiAce tourist vans, and coaster buses with experienced chauffeurs with Trip Himalaya.';
            }
            if (empty($img)) {
                $img = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200';
            }
        } elseif ($type === 'permit-details' || $type === 'work-permit-details') {
            $permitLabel = getPermitTypeLabel($permitType);
            $raw = @file_get_contents($backendApiBase . '/countries/' . urlencode($id), false, $ctx);
            if ($raw) {
                $json = json_decode($raw, true);
                $country = $json['data'] ?? $json;
                $cName = $country['country_name'] ?? ('Country #' . $id);
                if (empty($title)) {
                    $title = $cName . ' – ' . $permitLabel;
                }
                if (empty($desc)) {
                    $desc = !empty($country['short_description'])
                        ? strip_tags((string)$country['short_description'])
                        : ("Official labor clearance (shram), " . strtolower($permitLabel) . ", and employment visa assistance for " . $cName . " with Trip Himalaya Tours & Travels.");
                    if (mb_strlen($desc) > 160) $desc = mb_substr($desc, 0, 157) . '...';
                }
                if (empty($img)) {
                    $img = $country['image'] ?? '';
                }
            } else {
                $knownCountries = [
                    '1' => 'United Arab Emirates',
                    '2' => 'Thailand',
                    '3' => 'Malaysia',
                    '4' => 'Qatar',
                    '5' => 'Saudi Arabia',
                    '6' => 'Kuwait',
                    '7' => 'Bahrain',
                    '8' => 'Oman',
                    '9' => 'Japan',
                    '10' => 'South Korea',
                    '11' => 'Croatia',
                    '12' => 'Poland',
                    '13' => 'Romania',
                    '14' => 'Malta',
                    '15' => 'Cyprus',
                    '16' => 'Portugal',
                ];
                $cName = $knownCountries[(string)$id] ?? ('Country #' . $id);
                if (empty($title)) {
                    $title = $cName . ' – ' . $permitLabel;
                }
                if (empty($desc)) {
                    $desc = "Official labor clearance (shram), " . strtolower($permitLabel) . ", and employment visa assistance for " . $cName . " with Trip Himalaya Tours & Travels.";
                }
            }
            if (empty($img)) {
                $img = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200';
            }
        } elseif ($type === 'heli-services' || $type === 'heli') {
            $raw = @file_get_contents($backendApiBase . '/packages/' . urlencode($id), false, $ctx);
            if ($raw) {
                $json = json_decode($raw, true);
                $pkg = $json['data'] ?? $json;
                if (!empty($pkg['title']) && empty($title)) {
                    $title = $pkg['title'] . ' | Helicopter Services Nepal';
                }
                if (!empty($pkg['description']) && empty($desc)) {
                    $desc = strip_tags((string)$pkg['description']);
                    if (mb_strlen($desc) > 160) $desc = mb_substr($desc, 0, 157) . '...';
                }
                if (empty($img)) {
                    $img = $pkg['main_image'] ?? ($pkg['image'] ?? '');
                }
            }
            if (empty($title)) {
                $readableHeli = ucwords(str_replace(['-', '_'], ' ', $id));
                $title = (stripos($readableHeli, 'heli') !== false ? $readableHeli : ($readableHeli . ' Helicopter Tour')) . ' | Trip Himalaya';
            }
            if (empty($desc)) {
                $desc = 'Experience scenic mountain flights, high-altitude private charter, and emergency rescue with Trip Himalaya Tours & Travels.';
            }
            if (empty($img)) {
                $img = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200';
            }
        } elseif ($type === 'insurance-details' || $type === 'insurance-detail') {
            $raw = @file_get_contents($backendApiBase . '/insurance-plans/show/' . urlencode($id), false, $ctx);
            if ($raw) {
                $json = json_decode($raw, true);
                $plan = $json['data'] ?? $json;
                if (!empty($plan['name']) && empty($title)) {
                    $title = $plan['name'] . ' – Travel Insurance | Trip Himalaya';
                }
                if (!empty($plan['subtitle']) && empty($desc)) {
                    $desc = $plan['subtitle'];
                } elseif (!empty($plan['aboutText']) && empty($desc)) {
                    $desc = strip_tags((string)$plan['aboutText']);
                    if (mb_strlen($desc) > 160) $desc = mb_substr($desc, 0, 157) . '...';
                }
                if (empty($img)) {
                    $img = $plan['heroImage'] ?? ($plan['image'] ?? '');
                }
            } else {
                $knownPlans = [
                    'plan-trek-standard' => [
                        'title' => 'Standard Cultural & Foothill Plan – Travel Insurance | Trip Himalaya',
                        'desc'  => 'Medical and emergency protection for cultural tours and foothill trekking up to 3,000 meters in Nepal.',
                        'img'   => 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1400',
                    ],
                    'plan-high-altitude' => [
                        'title' => 'High-Altitude Alpine & Heli Rescue Plan – Travel Insurance | Trip Himalaya',
                        'desc'  => 'Comprehensive high-altitude medical coverage, acute mountain sickness cover, and immediate helicopter evacuation up to 6,000 meters.',
                        'img'   => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1400',
                    ],
                    'plan-extreme-expedition' => [
                        'title' => 'Extreme Mountaineering & Peak Climbing Plan – Travel Insurance | Trip Himalaya',
                        'desc'  => 'Technical climbing, 8,000m peak expedition, search and rescue, and extreme high-altitude hospitalization coverage in Nepal.',
                        'img'   => 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1400',
                    ],
                    'plan-international' => [
                        'title' => 'Global Outbound & Schengen Compliant Plan – Travel Insurance | Trip Himalaya',
                        'desc'  => 'Worldwide coverage meeting Schengen visa mandatory €30,000 medical requirements for international travelers departing Nepal.',
                        'img'   => 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1400',
                    ],
                ];
                if (isset($knownPlans[(string)$id])) {
                    if (empty($title)) $title = $knownPlans[(string)$id]['title'];
                    if (empty($desc))  $desc  = $knownPlans[(string)$id]['desc'];
                    if (empty($img))   $img   = $knownPlans[(string)$id]['img'];
                }
            }
            if (empty($title)) {
                $readablePlan = ucwords(str_replace(['-', '_'], ' ', $id));
                $title = $readablePlan . ' – Himalayan Travel Insurance | Trip Himalaya';
            }
            if (empty($desc)) {
                $desc = 'Comprehensive Himalayan travel insurance, high-altitude emergency medical coverage, and helicopter evacuation support in Nepal with Trip Himalaya.';
            }
            if (empty($img)) {
                $img = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200';
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
                    if (mb_strlen($desc) > 160) $desc = mb_substr($desc, 0, 157) . '...';
                }
                if (empty($img)) {
                    $img = $doc['image'] ?? '';
                }
            }
        } elseif ($type === 'watch' || $type === 'video') {
            if (empty($title)) {
                $title = 'Himalayan Adventure Travel Video Vlogs | Trip Himalaya';
            }
            if (empty($desc)) {
                $desc = 'Watch breathtaking journey visual vlogs, trekking expeditions, and cultural documentaries across Nepal with Trip Himalaya Tours & Travels.';
            }
            if (empty($img)) {
                $img = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200';
            }
        } elseif ($type === 'blog' || $type === 'blog-details') {
            if (empty($title)) {
                $title = 'Travel Stories, Trekking Guides & Himalayan Tips | Trip Himalaya';
            }
            if (empty($desc)) {
                $desc = 'Discover in-depth travel guides, trekking routes, equipment checklists, and cultural insights from Nepal travel specialists at Trip Himalaya.';
            }
            if (empty($img)) {
                $img = 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&q=80&w=1200';
            }
        } elseif ($type === 'service') {
            $readableService = ucwords(str_replace(['-', '_'], ' ', $id));
            if (empty($title)) {
                $title = $readableService . ' Services | Trip Himalaya Tours & Travels';
            }
            if (empty($desc)) {
                $desc = "Explore premier " . $readableService . " services, itineraries, and packages with authorized travel agency Trip Himalaya Tours & Travels.";
            }
            if (empty($img)) {
                $img = 'https://triphimalaya.com.np/Logo.png';
            }
        }
    } catch (\Throwable $e) {
        // Continue with fallbacks
    }
}

// 4. Default fallbacks if still empty
if (empty($title)) {
    if (!empty($permitType)) {
        $title = 'Work Permit – ' . getPermitTypeLabel($permitType) . ' | Trip Himalaya Tours & Travels';
    } else {
        $title = 'Trip Himalaya Tours and Travels Pvt. Ltd. | Nepal Tours, Treks & Visas - Kathmandu';
    }
}
if (empty($desc)) {
    $desc = 'Trip Himalaya Tours and Travels Pvt. Ltd. is an authorized premier travel agency established in 2025 near Airport, Kathmandu, Nepal, offering domestic and international tour packages, Himalayan treks, and visa services.';
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

$isCrawler = isSocialCrawler();

// 6. If request is from a human visitor (NOT a social crawler), immediately redirect to target page!
if (!$isCrawler) {
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

  <!-- Canonical link pointing directly to real clean content URL -->
  <link rel="canonical" href="<?= !empty($cleanTarget) ? $cleanTarget : $cleanShare ?>">

  <!-- Geo & Local SEO Tags -->
  <meta name="geo.region" content="NP-BA">
  <meta name="geo.placename" content="Airport, Kathmandu, Nepal">
  <meta name="geo.position" content="27.6970;85.3590">
  <meta name="ICBM" content="27.6970, 85.3590">

  <!-- Search Engine Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": <?= json_encode($cleanTitle, JSON_UNESCAPED_SLASHES) ?>,
    "description": <?= json_encode($cleanDesc, JSON_UNESCAPED_SLASHES) ?>,
    "image": <?= json_encode($cleanImg, JSON_UNESCAPED_SLASHES) ?>,
    "provider": {
      "@type": "TravelAgency",
      "name": "Trip Himalaya Tours and Travels Pvt. Ltd.",
      "legalName": "Trip Himalaya Tours and Travels Pvt. Ltd.",
      "foundingDate": "2025",
      "url": "https://triphimalaya.com.np",
      "telephone": "+977-9851420882",
      "email": "triphimalayatt@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Airport, Sinamangal",
        "addressLocality": "Kathmandu",
        "addressRegion": "Bagmati",
        "postalCode": "44600",
        "addressCountry": "NP"
      }
    }
  }
  </script>

<?php if (!$isCrawler): ?>
  <!-- Instant Client Redirect for human visitors only -->
  <meta http-equiv="refresh" content="0;url=<?= $cleanTarget ?>">
  <script>
    window.location.replace(<?= json_encode($targetUrl, JSON_UNESCAPED_SLASHES) ?>);
  </script>
<?php endif; ?>
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
