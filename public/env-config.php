<?php
/**
 * Trip Himalaya Tours & Travels - Runtime Environment Config Exposer
 * Reads server-side .env.production on cPanel and outputs client-safe VITE_* variables as JavaScript.
 * 
 * STRICT SECURITY NOTE:
 * Only variables starting with 'VITE_' are exposed to the browser.
 * Sensitive server variables (e.g. MAIL_PASSWORD, DB_PASSWORD) are strictly withheld.
 */

// Disable caching so changes made to .env.production on cPanel reflect immediately
header('Content-Type: application/javascript; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

$envSearchPaths = [
    '/home8/triphima/.env.production',
    '/home8/triphima/repositories/THTT-Frontend/.env.production',
    '/home8/triphima/repositories/THTT-Frontend/env.production',
    dirname(__DIR__) . '/.env.production',
    dirname(__DIR__) . '/env.production',
    dirname(__DIR__) . '/.env',
];

$clientVars = [
    'VITE_BASE_URL' => 'https://thtt-backend.triphimalaya.com.np/api',
    'VITE_GOOGLE_CLIENT_ID' => '178127958696-vk4jhq3sh9jk8ki3h92c7q832qtemlb5.apps.googleusercontent.com',
];

foreach ($envSearchPaths as $envPath) {
    if (file_exists($envPath) && is_readable($envPath)) {
        $lines = @file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines !== false) {
            foreach ($lines as $line) {
                $line = trim($line);
                if (empty($line) || strpos($line, '#') === 0) continue;
                if (strpos($line, '=') !== false) {
                    list($key, $val) = explode('=', $line, 2);
                    $key = trim($key);
                    $val = trim(trim($val), "\"'\r\n");
                    // Only expose frontend VITE_* variables
                    if (strpos($key, 'VITE_') === 0) {
                        $clientVars[$key] = $val;
                    }
                }
            }
            break;
        }
    }
}

$json = json_encode($clientVars, JSON_UNESCAPED_SLASHES);
echo "window.__ENV__ = Object.assign(window.__ENV__ || {}, " . $json . ");\n";
