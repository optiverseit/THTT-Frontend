<?php
/**
 * Trip Himalaya Tours & Travels - Form Inquiry Email Dispatcher
 * Compatible with cPanel / Apache PHP 7.4 - 8.x
 */

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
    exit();
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid JSON payload"]);
    exit();
}

// --- ANTI-SPAM & ANTI-PHISHING DEFENSE ---
// 1. Honeypot check (Automated bots fill hidden fields)
$honeypot = trim($data['website'] ?? $data['url'] ?? $data['company_fax'] ?? $data['honeypot'] ?? '');
if (!empty($honeypot)) {
    // Silently drop bot spam without executing SMTP
    http_response_code(200);
    echo json_encode(["success" => true, "message" => "Inquiry received."]);
    exit();
}

function cleanForHtml($str) {
    return htmlspecialchars($str ?? '', ENT_QUOTES, 'UTF-8');
}

$rawFullName = str_replace(["\r", "\n"], '', trim($data['fullName'] ?? ''));
$rawNationality = str_replace(["\r", "\n"], '', trim($data['nationality'] ?? ''));
$rawEmail = str_replace(["\r", "\n"], '', trim($data['email'] ?? ''));
$rawPhone = str_replace(["\r", "\n"], '', trim($data['phone'] ?? ''));
$rawService = str_replace(["\r", "\n"], '', trim($data['serviceOrDepartment'] ?? $data['service'] ?? $data['department'] ?? 'General Inquiry'));
$rawMessage = trim($data['message'] ?? '');
$formType = trim($data['formType'] ?? 'quote'); // 'quote' | 'contact'

if (empty($rawFullName) || empty($rawEmail) || empty($rawPhone)) {
    http_response_code(422);
    echo json_encode(["success" => false, "message" => "Full Name, Email, and Phone are required."]);
    exit();
}

// 2. Strict Email Syntax Validation
if (!filter_var($rawEmail, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(["success" => false, "message" => "Invalid email address format."]);
    exit();
}

// 3. Phishing, Malware & High-Volume Spam Link Filter
$combinedPayload = strtolower($rawFullName . ' ' . $rawMessage);
$spamPatterns = ['viagra', 'cialis', 'casino', 'poker', 'crypto investment', 'whatsapp me on', '.ru/', 'bit.ly/'];
foreach ($spamPatterns as $pattern) {
    if (strpos($combinedPayload, $pattern) !== false) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Message flagged as spam."]);
        exit();
    }
}
// Block messages with more than 2 external URLs (common spam signature)
if (preg_match_all('#https?://#i', $rawMessage) > 2) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Too many URLs in message body."]);
    exit();
}

// Dynamically load .env.production or .env file if available
$envSearchPaths = [
    '/home8/triphima/.env.production',
    '/home8/triphima/repositories/THTT-Frontend/.env.production',
    '/home8/triphima/repositories/THTT-Frontend/env.production',
    dirname(__DIR__) . '/.env.production',
    dirname(__DIR__) . '/env.production',
    dirname(__DIR__) . '/.env',
];

foreach ($envSearchPaths as $envPath) {
    if (file_exists($envPath) && is_readable($envPath)) {
        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line) || strpos($line, '#') === 0) continue;
            if (strpos($line, '=') !== false) {
                list($key, $val) = explode('=', $line, 2);
                $key = trim($key);
                $val = trim(trim($val), "\"'\r\n");
                putenv("$key=$val");
                $_ENV[$key] = $val;
                $_SERVER[$key] = $val;
            }
        }
        break;
    }
}

// SMTP Configuration
$smtpHost = getenv('MAIL_HOST') ? ('ssl://' . getenv('MAIL_HOST')) : 'ssl://smtp.gmail.com';
$smtpPort = (int)(getenv('MAIL_PORT') ?: 465);
if ($smtpPort === 587) {
    $smtpPort = 465;
}
$smtpUser = getenv('MAIL_USERNAME') ?: 'triphimalaya.thtt@gmail.com';
$smtpPass = getenv('MAIL_PASSWORD') ?: 'qatkyawtfujfypjo';
$fromEmail = getenv('MAIL_FROM_ADDRESS') ?: 'triphimalaya.thtt@gmail.com';
$fromName = getenv('MAIL_FROM_NAME') ?: 'Trip Himalaya';

// Compulsory Admin Notification Recipient
$adminEmail = getenv('NOTIFICATION_EMAIL') ?: getenv('MAIL_TO_ADDRESS') ?: 'amitkus012@gmail.com';

// Official Department Directory Mapping
$teamDirectory = [
    "Air Ticketing Team" => ["email" => "dev.triphimalayatt@gmail.com", "phone" => "9851420882", "name" => "Air Ticketing Team"],
    "Air Ticket" => ["email" => "dev.triphimalayatt@gmail.com", "phone" => "9851420882", "name" => "Air Ticketing Team"],
    "Tours & Holidays Team" => ["email" => "pradip.triphimalayatt@gmail.com", "phone" => "9851403761", "name" => "Tours & Holidays Team"],
    "Tours" => ["email" => "pradip.triphimalayatt@gmail.com", "phone" => "9851403761", "name" => "Tours & Holidays Team"],
    "Trekking & Adventure Team" => ["email" => "pradip.triphimalayatt@gmail.com", "phone" => "9851403761", "name" => "Trekking & Adventure Team"],
    "Trekking" => ["email" => "pradip.triphimalayatt@gmail.com", "phone" => "9851403761", "name" => "Trekking & Adventure Team"],
    "Adventure Activities" => ["email" => "pradip.triphimalayatt@gmail.com", "phone" => "9851403761", "name" => "Trekking & Adventure Team"],
    "Hotel Booking Team" => ["email" => "pradip.triphimalayatt@gmail.com", "phone" => "9851403761", "name" => "Hotel Booking Team"],
    "Hotel Booking" => ["email" => "pradip.triphimalayatt@gmail.com", "phone" => "9851403761", "name" => "Hotel Booking Team"],
    "Visa & Documentation Team" => ["email" => "dev.triphimalayatt@gmail.com", "phone" => "9851420882", "name" => "Visa & Documentation Team"],
    "Visa Services" => ["email" => "dev.triphimalayatt@gmail.com", "phone" => "9851420882", "name" => "Visa & Documentation Team"],
    "Regular Route Team" => ["email" => "samarpan.triphimalayatt@gmail.com", "phone" => "9851356882", "name" => "Regular Route Team"],
    "Regular Route" => ["email" => "samarpan.triphimalayatt@gmail.com", "phone" => "9851356882", "name" => "Regular Route Team"],
    "Vehicle Rental Team" => ["email" => "samarpan.triphimalayatt@gmail.com", "phone" => "9851356882", "name" => "Vehicle Rental Team"],
    "Vehicle Rental" => ["email" => "samarpan.triphimalayatt@gmail.com", "phone" => "9851356882", "name" => "Vehicle Rental Team"],
    "Travel Insurance Team" => ["email" => "bhishan.triphimalayatt@gmail.com", "phone" => "9851403760", "name" => "Travel Insurance Team"],
    "Travel Insurance" => ["email" => "bhishan.triphimalayatt@gmail.com", "phone" => "9851403760", "name" => "Travel Insurance Team"],
    "Heli Services Team" => ["email" => "dev.triphimalayatt@gmail.com", "phone" => "9851420882", "name" => "Heli Services Team"],
    "Heli Services" => ["email" => "dev.triphimalayatt@gmail.com", "phone" => "9851420882", "name" => "Heli Services Team"],
    "Accounts & Billing Team" => ["email" => "actriphimalaya@gmail.com", "phone" => "9851403759", "name" => "Accounts & Billing Team"],
    "Customer Support Team" => ["email" => "samarpan.triphimalayatt@gmail.com", "phone" => "9851356882", "name" => "Customer Support Team"],
    "Other" => ["email" => "samarpan.triphimalayatt@gmail.com", "phone" => "9851356882", "name" => "Customer Support Team"],
];

$rawProvidedTeamEmail = trim($data['teamEmail'] ?? '');
$rawProvidedTeamPhone = trim($data['teamPhone'] ?? '');

$matchedTeam = null;
if (!empty($rawProvidedTeamEmail) && !empty($rawProvidedTeamPhone)) {
    $matchedTeam = [
        "email" => $rawProvidedTeamEmail,
        "phone" => $rawProvidedTeamPhone,
        "name" => $rawService
    ];
} elseif (isset($teamDirectory[$rawService])) {
    $matchedTeam = $teamDirectory[$rawService];
} else {
    $lower = strtolower($rawService);
    foreach ($teamDirectory as $k => $info) {
        if (strpos($lower, strtolower($k)) !== false || strpos(strtolower($k), $lower) !== false) {
            $matchedTeam = $info;
            break;
        }
    }
    if (!$matchedTeam) {
        $matchedTeam = ["email" => "samarpan.triphimalayatt@gmail.com", "phone" => "9851356882", "name" => "Customer Support Team"];
    }
}

$teamEmail = $matchedTeam['email'];
$teamPhone = $matchedTeam['phone'];
$teamName = cleanForHtml($matchedTeam['name']);

$fullName = cleanForHtml($rawFullName);
$nationality = !empty($rawNationality) ? cleanForHtml($rawNationality) : 'Not specified';
$email = cleanForHtml($rawEmail);
$phone = cleanForHtml($rawPhone);
$service = cleanForHtml($rawService);
$message = !empty($rawMessage) ? nl2br(cleanForHtml($rawMessage)) : 'No additional message provided.';

$isQuote = ($formType === 'quote');
$formTitle = $isQuote ? 'Plan Your Trip / Free Quote' : 'Get In Touch / Contact Us';
$fieldLabel = $isQuote ? 'Selected Service' : 'Department of Interest';
$refCode = "TH-" . rand(100000, 999999);
$subjectAdmin = ($isQuote ? "🏔️ [New Quote" : "📬 [New Inquiry") . " #{$refCode}] {$rawFullName} - {$rawService}";
$subjectUser = "We've Received Your Request! [#{$refCode}] - Trip Himalaya Tours & Travels";

// 1. Admin Email Template
$adminHtml = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Inquiry - Trip Himalaya</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0721;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#334155;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0f0721;padding:30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:600px;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.3);border:1px solid rgba(139,44,255,0.2);" cellspacing="0" cellpadding="0">
          <tr>
            <td style="background:linear-gradient(135deg,#FF4FA3 0%,#8B2CFF 100%);padding:32px 30px;text-align:left;">
              <span style="display:inline-block;background-color:rgba(255,255,255,0.22);color:#ffffff;padding:4px 12px;border-radius:50px;font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;">
                {$formTitle}
              </span>
              <h1 style="color:#ffffff;font-size:24px;font-weight:800;margin:10px 0 4px 0;letter-spacing:-0.5px;">
                New Submission Received
              </h1>
              <p style="color:rgba(255,255,255,0.85);font-size:13px;margin:0;">
                Trip Himalaya Tours &amp; Travels Pvt. Ltd.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:30px;">
              <p style="font-size:14px;color:#475569;margin:0 0 20px 0;line-height:1.6;">
                A new customer inquiry has been received. Assigned to <strong>{$teamName}</strong>:
              </p>
              <table role="presentation" width="100%" style="background-color:#f8fafc;border-radius:14px;border:1px solid #e2e8f0;overflow:hidden;margin-bottom:24px;" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;width:38%;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Reference ID</td>
                  <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:800;color:#8B2CFF;">#{$refCode}</td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Full Name</td>
                  <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:700;color:#1e0d3d;">{$fullName}</td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Nationality</td>
                  <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:600;color:#1e0d3d;">{$nationality}</td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Email Address</td>
                  <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:600;color:#8B2CFF;">
                    <a href="mailto:{$email}" style="color:#8B2CFF;text-decoration:none;">{$email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Phone / WhatsApp</td>
                  <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:600;color:#0f172a;">
                    <a href="tel:{$phone}" style="color:#0f172a;text-decoration:none;">{$phone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">{$fieldLabel}</td>
                  <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:700;color:#E91E63;">
                    <span style="display:inline-block;background-color:#fdf2f8;color:#E91E63;padding:3px 10px;border-radius:8px;border:1px solid rgba(233,30,99,0.2);">
                      {$service}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Assigned Department</td>
                  <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:600;color:#1e0d3d;">
                    {$teamName} (WhatsApp: <a href="https://wa.me/977{$teamPhone}" style="color:#25D366;font-weight:bold;text-decoration:none;">+977-{$teamPhone}</a>)
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">Message / Request</td>
                  <td style="padding:14px 18px;font-size:14px;color:#334155;line-height:1.6;">
                    {$message}
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center" style="padding-bottom:10px;">
                    <a href="mailto:{$email}?subject=Re:%20Trip%20Himalaya%20Inquiry%20-%20{$service}" style="display:inline-block;background:linear-gradient(135deg,#FF4FA3 0%,#8B2CFF 100%);color:#ffffff;text-decoration:none;font-size:13px;font-weight:800;padding:12px 24px;border-radius:12px;letter-spacing:0.5px;margin-right:8px;box-shadow:0 4px 12px rgba(139,44,255,0.35);">
                      ✉️ Reply to Customer
                    </a>
                    <a href="https://wa.me/{$phone}" target="_blank" style="display:inline-block;background-color:#25D366;color:#ffffff;text-decoration:none;font-size:13px;font-weight:800;padding:12px 24px;border-radius:12px;letter-spacing:0.5px;box-shadow:0 4px 12px rgba(37,211,102,0.3);">
                      <img src="https://img.icons8.com/ios-filled/50/ffffff/whatsapp--v1.png" width="16" height="16" alt="WhatsApp" style="vertical-align:middle;margin-right:6px;border:0;display:inline-block;" />Chat on Customer's WhatsApp
                    </a>
                  </td>
                </tr>
              </table>
              <div style="border-top:1px solid #f1f5f9;padding-top:18px;text-align:center;color:#94a3b8;font-size:11px;line-height:1.5;">
                Trip Himalaya Tours &amp; Travels Pvt. Ltd. • Airport, Shambhu Marg, Kathmandu, Nepal<br/>
                Official Support: +977-9851420882 | Landline: 01-5922697
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;

// 2. Customer Confirmation Template
$userHtml = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Thank you for contacting Trip Himalaya</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0721;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#334155;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0f0721;padding:30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:600px;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.3);border:1px solid rgba(139,44,255,0.2);" cellspacing="0" cellpadding="0">
          <tr>
            <td style="background:linear-gradient(135deg,#FF4FA3 0%,#8B2CFF 100%);padding:36px 30px;text-align:center;">
              <div style="display:inline-block;background-color:rgba(255,255,255,0.22);color:#ffffff;padding:4px 14px;border-radius:50px;font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:12px;">
                Namaste 🙏
              </div>
              <h1 style="color:#ffffff;font-size:26px;font-weight:800;margin:0 0 6px 0;letter-spacing:-0.5px;">
                We've Received Your Request!
              </h1>
              <p style="color:rgba(255,255,255,0.9);font-size:14px;margin:0;">
                Trip Himalaya Tours &amp; Travels Pvt. Ltd.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 30px;">
              <p style="font-size:15px;color:#1e0d3d;font-weight:600;margin:0 0 14px 0;">
                Dear {$fullName},
              </p>
              <p style="font-size:14px;color:#475569;margin:0 0 20px 0;line-height:1.65;">
                Thank you for reaching out to Trip Himalaya! We have received your inquiry regarding <strong>{$service}</strong>. Our dedicated <strong>{$teamName}</strong> counselor will review your requirements and reach out within <strong>30 minutes</strong>.
              </p>
              <div style="background-color:#fbf7ff;border:1px solid #ebd8ff;border-radius:14px;padding:18px 20px;margin-bottom:24px;">
                <h3 style="color:#8B2CFF;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px 0;">
                  📋 Summary of Your Submission
                </h3>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:13px;color:#334155;">
                  <tr>
                    <td style="padding:4px 0;width:35%;color:#64748b;font-weight:600;">Reference No:</td>
                    <td style="padding:4px 0;font-weight:800;color:#8B2CFF;">#{$refCode}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;width:35%;color:#64748b;font-weight:600;">{$fieldLabel}:</td>
                    <td style="padding:4px 0;font-weight:700;color:#E91E63;">{$service}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#64748b;font-weight:600;">Dedicated Desk:</td>
                    <td style="padding:4px 0;font-weight:700;color:#1e0d3d;">{$teamName}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#64748b;font-weight:600;">Nationality:</td>
                    <td style="padding:4px 0;font-weight:600;">{$nationality}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#64748b;font-weight:600;">Phone / WhatsApp:</td>
                    <td style="padding:4px 0;font-weight:600;">{$phone}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#64748b;font-weight:600;vertical-align:top;">Your Message:</td>
                    <td style="padding:4px 0;font-style:italic;color:#475569;">"{$message}"</td>
                  </tr>
                </table>
              </div>
              <div style="background-color:#f8fafc;border-radius:14px;padding:20px;text-align:center;margin-bottom:24px;">
                <p style="font-size:13px;font-weight:700;color:#1e0d3d;margin:0 0 6px 0;">
                  Want instant assistance or direct booking support?
                </p>
                <p style="font-size:12px;color:#64748b;margin:0 0 14px 0;">
                  Connect directly with the <strong>{$teamName}</strong> on WhatsApp:
                </p>
                <a href="https://wa.me/977{$teamPhone}?text=Hello%20Trip%20Himalaya%20({$service})%2C%20I%20just%20submitted%20an%20inquiry%20regarding%20my%20travel%20plans." target="_blank" style="display:inline-block;background-color:#25D366;color:#ffffff;text-decoration:none;font-size:13px;font-weight:800;padding:12px 24px;border-radius:12px;letter-spacing:0.5px;box-shadow:0 4px 12px rgba(37,211,102,0.3);">
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/whatsapp--v1.png" width="18" height="18" alt="WhatsApp" style="vertical-align:middle;margin-right:8px;border:0;display:inline-block;" />Chat with {$teamName} on WhatsApp (+977-{$teamPhone})
                </a>
              </div>
              <div style="background-color:#f8fafc;border-left:4px solid #8B2CFF;padding:14px 16px;border-radius:8px;margin-bottom:24px;font-size:12px;color:#475569;line-height:1.5;text-align:left;">
                <strong style="color:#1e0d3d;">🛡️ Official Corporate Anti-Phishing Notice:</strong><br/>
                Trip Himalaya Tours &amp; Travels Pvt. Ltd. is a legally registered company in Nepal (Regd. Office: Airport, Shambhu Marg, Kathmandu). We will <strong>never</strong> ask for your bank password, OTP, or credit card PIN over email or WhatsApp. Always verify communications originate from <strong>@triphimalaya.com.np</strong> or verified phone lines: +977-9851420882.
              </div>
              <div style="border-top:1px solid #f1f5f9;padding-top:20px;text-align:center;color:#94a3b8;font-size:11px;line-height:1.6;">
                <strong>Trip Himalaya Tours &amp; Travels Pvt. Ltd.</strong><br/>
                Airport, Shambhu Marg, Road No. 04, Kathmandu, Nepal<br/>
                Direct: +977-9851420882 | Reservations: +977-9851403761 | Landline: 01-5922697<br/>
                <a href="https://triphimalaya.com.np" style="color:#8B2CFF;text-decoration:none;font-weight:bold;">www.triphimalaya.com.np</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;

/**
 * Socket-based SMTP mail sending function for standard SSL SMTP
 */
function sendSmtpMail($host, $port, $user, $pass, $from, $fromName, $to, $subject, $html) {
    $recipients = is_array($to) ? $to : [$to];
    $socket = @fsockopen($host, $port, $errno, $errstr, 15);
    if (!$socket) {
        throw new Exception("Could not connect to SMTP server: $errstr ($errno)");
    }

    $read = function() use ($socket) {
        $res = '';
        while ($str = fgets($socket, 515)) {
            $res .= $str;
            if (substr($str, 3, 1) === ' ') break;
        }
        return $res;
    };

    $send = function($cmd) use ($socket) {
        fputs($socket, $cmd . "\r\n");
    };

    $read(); // 220 banner

    $send("EHLO localhost");
    $read(); // 250

    $send("AUTH LOGIN");
    $read(); // 334

    $send(base64_encode($user));
    $read(); // 334

    $send(base64_encode($pass));
    $authRes = $read(); // 235
    if (strpos($authRes, '235') === false) {
        fclose($socket);
        throw new Exception("SMTP Authentication failed: " . trim($authRes));
    }

    $send("MAIL FROM:<$from>");
    $read();

    foreach ($recipients as $recipient) {
        $send("RCPT TO:<$recipient>");
        $read();
    }

    $send("DATA");
    $read();

    $toHeader = implode(', ', array_map(function($r) { return "<$r>"; }, $recipients));

    $messageId = sprintf("<%s.%s@triphimalaya.com.np>", bin2hex(random_bytes(12)), time());
    $headers = [
        "From: =?UTF-8?B?" . base64_encode($fromName) . "?= <$from>",
        "Reply-To: =?UTF-8?B?" . base64_encode($fromName) . "?= <$from>",
        "To: $toHeader",
        "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=",
        "Date: " . date('r'),
        "Message-ID: $messageId",
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
        "Organization: Trip Himalaya Tours & Travels Pvt. Ltd.",
        "X-Mailer: Trip Himalaya Authenticated Mailer v2.0",
        "X-Entity-Ref-ID: triphimalaya-auth-" . time()
    ];

    $emailData = implode("\r\n", $headers) . "\r\n\r\n" . $html . "\r\n.";
    $send($emailData);
    $dataRes = $read();

    $send("QUIT");
    $read();
    fclose($socket);

    if (strpos($dataRes, '250') === false) {
        throw new Exception("SMTP DATA send failed: " . trim($dataRes));
    }

    return true;
}

$errors = [];

// 1. Combined Compulsory Admin & Team Notification in a single fast SMTP connection
$adminRecipients = [$adminEmail];
if (!empty($teamEmail) && filter_var($teamEmail, FILTER_VALIDATE_EMAIL) && strtolower($teamEmail) !== strtolower($adminEmail)) {
    $adminRecipients[] = $teamEmail;
}

try {
    sendSmtpMail(
        $smtpHost,
        $smtpPort,
        $smtpUser,
        $smtpPass,
        $fromEmail,
        $fromName,
        $adminRecipients,
        $subjectAdmin,
        $adminHtml
    );
} catch (Exception $e) {
    $errors[] = "Admin/Team mail error: " . $e->getMessage();
}

// 2. Customer Confirmation Email
if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
    try {
        sendSmtpMail(
            $smtpHost,
            $smtpPort,
            $smtpUser,
            $smtpPass,
            $fromEmail,
            $fromName,
            $email,
            $subjectUser,
            $userHtml
        );
    } catch (Exception $e) {
        $errors[] = "Customer confirmation error: " . $e->getMessage();
    }
}

if (!empty($errors) && count($errors) >= 2) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => implode("; ", $errors)]);
} else {
    echo json_encode([
        "success" => true,
        "message" => "Inquiry notification sent successfully!",
        "teamEmail" => $teamEmail,
        "teamPhone" => $teamPhone
    ]);
}
