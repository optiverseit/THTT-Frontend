import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tls from "node:tls";
import fs from "node:fs";
import path from "node:path";

function escapeHtml(text?: string): string {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function loadEnvValue(key: string, defaultValue: string): string {
  const envFiles = [
    path.resolve(process.cwd(), ".env.production"),
    path.resolve(process.cwd(), ".env"),
  ];
  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, "utf8");
      const match = content.match(new RegExp(`^${key}\\s*=\\s*["']?([^"'\\r\\n]+)`, "m"));
      if (match && match[1]) {
        return match[1].trim();
      }
    }
  }
  return defaultValue;
}

const TEAMS_DIRECTORY: Record<string, { email: string; phone: string; name: string }> = {
  "Air Ticketing Team": { email: "dev.triphimalayatt@gmail.com", phone: "9851420882", name: "Air Ticketing Team" },
  "Air Ticket": { email: "dev.triphimalayatt@gmail.com", phone: "9851420882", name: "Air Ticketing Team" },
  "Tours & Holidays Team": { email: "pradip.triphimalayatt@gmail.com", phone: "9851403761", name: "Tours & Holidays Team" },
  "Tours": { email: "pradip.triphimalayatt@gmail.com", phone: "9851403761", name: "Tours & Holidays Team" },
  "Trekking & Adventure Team": { email: "pradip.triphimalayatt@gmail.com", phone: "9851403761", name: "Trekking & Adventure Team" },
  "Trekking": { email: "pradip.triphimalayatt@gmail.com", phone: "9851403761", name: "Trekking & Adventure Team" },
  "Adventure Activities": { email: "pradip.triphimalayatt@gmail.com", phone: "9851403761", name: "Trekking & Adventure Team" },
  "Hotel Booking Team": { email: "pradip.triphimalayatt@gmail.com", phone: "9851403761", name: "Hotel Booking Team" },
  "Hotel Booking": { email: "pradip.triphimalayatt@gmail.com", phone: "9851403761", name: "Hotel Booking Team" },
  "Visa & Documentation Team": { email: "dev.triphimalayatt@gmail.com", phone: "9851420882", name: "Visa & Documentation Team" },
  "Visa Services": { email: "dev.triphimalayatt@gmail.com", phone: "9851420882", name: "Visa & Documentation Team" },
  "Regular Route Team": { email: "samarpan.triphimalayatt@gmail.com", phone: "9851356882", name: "Regular Route Team" },
  "Regular Route": { email: "samarpan.triphimalayatt@gmail.com", phone: "9851356882", name: "Regular Route Team" },
  "Vehicle Rental Team": { email: "samarpan.triphimalayatt@gmail.com", phone: "9851356882", name: "Vehicle Rental Team" },
  "Vehicle Rental": { email: "samarpan.triphimalayatt@gmail.com", phone: "9851356882", name: "Vehicle Rental Team" },
  "Travel Insurance Team": { email: "bhishan.triphimalayatt@gmail.com", phone: "9851403760", name: "Travel Insurance Team" },
  "Travel Insurance": { email: "bhishan.triphimalayatt@gmail.com", phone: "9851403760", name: "Travel Insurance Team" },
  "Heli Services Team": { email: "dev.triphimalayatt@gmail.com", phone: "9851420882", name: "Heli Services Team" },
  "Heli Services": { email: "dev.triphimalayatt@gmail.com", phone: "9851420882", name: "Heli Services Team" },
  "Accounts & Billing Team": { email: "actriphimalaya@gmail.com", phone: "9851403759", name: "Accounts & Billing Team" },
  "Customer Support Team": { email: "samarpan.triphimalayatt@gmail.com", phone: "9851356882", name: "Customer Support Team" },
  "Other": { email: "samarpan.triphimalayatt@gmail.com", phone: "9851356882", name: "Customer Support Team" },
};

function resolveTeam(service: string) {
  if (TEAMS_DIRECTORY[service]) return TEAMS_DIRECTORY[service];
  const lower = (service || "").toLowerCase();
  for (const [k, v] of Object.entries(TEAMS_DIRECTORY)) {
    if (lower.includes(k.toLowerCase()) || k.toLowerCase().includes(lower)) {
      return v;
    }
  }
  return { email: "samarpan.triphimalayatt@gmail.com", phone: "9851356882", name: "Customer Support Team" };
}

function sendSmtpEmail({
  to,
  subject,
  htmlBody,
}: {
  to: string;
  subject: string;
  htmlBody: string;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(465, "smtp.gmail.com");
    socket.setEncoding("utf8");

    const authStr = Buffer.from(
      "\0triphimalaya.thtt@gmail.com\0qatkyawtfujfypjo"
    ).toString("base64");

    const rawEmail = [
      'From: "Trip Himalaya" <triphimalaya.thtt@gmail.com>',
      `To: <${to}>`,
      `Subject: =?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=UTF-8",
      "",
      htmlBody,
      ".",
    ].join("\r\n");

    let step = 0;
    socket.on("data", (chunk: string) => {
      if (step === 0 && chunk.startsWith("220")) {
        step = 1;
        socket.write("EHLO localhost\r\n");
      } else if (step === 1 && chunk.startsWith("250")) {
        step = 2;
        socket.write("AUTH PLAIN " + authStr + "\r\n");
      } else if (step === 2 && chunk.startsWith("235")) {
        step = 3;
        socket.write("MAIL FROM:<triphimalaya.thtt@gmail.com>\r\n");
      } else if (step === 3 && chunk.startsWith("250")) {
        step = 4;
        socket.write(`RCPT TO:<${to}>\r\n`);
      } else if (step === 4 && chunk.startsWith("250")) {
        step = 5;
        socket.write("DATA\r\n");
      } else if (step === 5 && chunk.startsWith("354")) {
        step = 6;
        socket.write(rawEmail + "\r\n");
      } else if (step === 6 && chunk.startsWith("250")) {
        step = 7;
        socket.write("QUIT\r\n");
        resolve();
      }
    });

    socket.on("error", (err: Error) => reject(err));
  });
}

function emailDevServerPlugin(): Plugin {
  return {
    name: "email-dev-server-plugin",
    configureServer(server) {
      server.middlewares.use(async (req: any, res: any, next: () => void) => {
        if (
          (req.url?.startsWith("/api/send-email") ||
            req.url?.startsWith("/send-email.php")) &&
          req.method === "POST"
        ) {
          let body = "";
          req.on("data", (chunk: any) => {
            body += chunk;
          });

          req.on("end", async () => {
            try {
              const data = JSON.parse(body || "{}");
              const {
                fullName,
                nationality,
                email,
                phone,
                serviceOrDepartment,
                message,
                formType,
                teamEmail: providedTeamEmail,
                teamPhone: providedTeamPhone,
              } = data;

              // Compulsory Admin Notification Recipient
              const adminNotificationEmail = loadEnvValue(
                "NOTIFICATION_EMAIL",
                "amitkus012@gmail.com"
              );

              // Associated Team Recipient & WhatsApp Phone
              const matchedTeam = (providedTeamEmail && providedTeamPhone)
                ? { email: providedTeamEmail, phone: providedTeamPhone, name: serviceOrDepartment }
                : resolveTeam(serviceOrDepartment);

              const teamEmail = matchedTeam.email;
              const teamPhone = matchedTeam.phone;
              const teamName = escapeHtml(matchedTeam.name);

              const isQuote = formType === "quote";
              const formTitle = isQuote
                ? "Plan Your Trip / Free Quote"
                : "Get In Touch / Contact Us";
              const fieldLabel = isQuote
                ? "Selected Service"
                : "Department of Interest";
              const subjectAdmin = `${isQuote ? "🏔️ [New Quote] " : "📬 [New Inquiry] "}${fullName} - ${serviceOrDepartment}`;
              const subjectUser =
                "We've Received Your Request! - Trip Himalaya Tours & Travels";

              const adminHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Inquiry - Trip Himalaya</title></head>
<body style="margin:0;padding:0;background-color:#0f0721;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#334155;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0f0721;padding:30px 15px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:600px;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.3);border:1px solid rgba(139,44,255,0.2);" cellspacing="0" cellpadding="0">
        <tr>
          <td style="background:linear-gradient(135deg,#FF4FA3 0%,#8B2CFF 100%);padding:32px 30px;text-align:left;">
            <span style="display:inline-block;background-color:rgba(255,255,255,0.22);color:#ffffff;padding:4px 12px;border-radius:50px;font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;">
              ${formTitle}
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
              A new customer inquiry has been received. Assigned to <strong>${teamName}</strong>:
            </p>
            <table role="presentation" width="100%" style="background-color:#f8fafc;border-radius:14px;border:1px solid #e2e8f0;overflow:hidden;margin-bottom:24px;" cellspacing="0" cellpadding="0">
              <tr>
                <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;width:38%;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Full Name</td>
                <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:700;color:#1e0d3d;">${escapeHtml(fullName)}</td>
              </tr>
              <tr>
                <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Nationality</td>
                <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:600;color:#1e0d3d;">${escapeHtml(nationality || "Not specified")}</td>
              </tr>
              <tr>
                <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Email Address</td>
                <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:600;color:#8B2CFF;">
                  <a href="mailto:${escapeHtml(email)}" style="color:#8B2CFF;text-decoration:none;">${escapeHtml(email)}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Phone / WhatsApp</td>
                <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:600;color:#0f172a;">
                  <a href="tel:${escapeHtml(phone)}" style="color:#0f172a;text-decoration:none;">${escapeHtml(phone)}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">${fieldLabel}</td>
                <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:700;color:#E91E63;">
                  <span style="display:inline-block;background-color:#fdf2f8;color:#E91E63;padding:3px 10px;border-radius:8px;border:1px solid rgba(233,30,99,0.2);">
                    ${escapeHtml(serviceOrDepartment)}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Assigned Department</td>
                <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:600;color:#1e0d3d;">
                  ${teamName} (WhatsApp: <a href="https://wa.me/977${teamPhone}" style="color:#25D366;font-weight:bold;text-decoration:none;">+977-${teamPhone}</a>)
                </td>
              </tr>
              <tr>
                <td style="padding:14px 18px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">Message / Request</td>
                <td style="padding:14px 18px;font-size:14px;color:#334155;line-height:1.6;">${escapeHtml(message || "No additional message provided.").replace(/\n/g, "<br/>")}</td>
              </tr>
            </table>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
              <tr>
                <td align="center" style="padding-bottom:10px;">
                  <a href="mailto:${escapeHtml(email)}?subject=Re:%20Trip%20Himalaya%20Inquiry%20-%20${encodeURIComponent(serviceOrDepartment)}" style="display:inline-block;background:linear-gradient(135deg,#FF4FA3 0%,#8B2CFF 100%);color:#ffffff;text-decoration:none;font-size:13px;font-weight:800;padding:12px 24px;border-radius:12px;letter-spacing:0.5px;margin-right:8px;box-shadow:0 4px 12px rgba(139,44,255,0.35);">
                    ✉️ Reply to Customer
                  </a>
                  <a href="https://wa.me/${escapeHtml(phone).replace(/[^0-9]/g, "")}" target="_blank" style="display:inline-block;background-color:#25D366;color:#ffffff;text-decoration:none;font-size:13px;font-weight:800;padding:12px 24px;border-radius:12px;letter-spacing:0.5px;box-shadow:0 4px 12px rgba(37,211,102,0.3);">
                    💬 Chat on Customer's WhatsApp
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
    </td></tr>
  </table>
</body>
</html>`;

              const userHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Thank you for contacting Trip Himalaya</title></head>
<body style="margin:0;padding:0;background-color:#0f0721;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#334155;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0f0721;padding:30px 15px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:600px;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.3);border:1px solid rgba(139,44,255,0.2);" cellspacing="0" cellpadding="0">
        <tr>
          <td style="background:linear-gradient(135deg,#FF4FA3 0%,#8B2CFF 100%);padding:36px 30px;text-align:center;">
            <div style="display:inline-block;background-color:rgba(255,255,255,0.22);color:#ffffff;padding:4px 14px;border-radius:50px;font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:12px;">
              Namaste &amp; Greetings 🙏
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
            <p style="font-size:15px;color:#1e0d3d;font-weight:600;margin:0 0 14px 0;">Dear ${escapeHtml(fullName)},</p>
            <p style="font-size:14px;color:#475569;margin:0 0 20px 0;line-height:1.65;">
              Thank you for reaching out to Trip Himalaya! We have received your inquiry regarding <strong>${escapeHtml(serviceOrDepartment)}</strong>. Our dedicated <strong>${teamName}</strong> counselor will review your requirements and reach out within <strong>30 minutes</strong>.
            </p>
            <div style="background-color:#fbf7ff;border:1px solid #ebd8ff;border-radius:14px;padding:18px 20px;margin-bottom:24px;">
              <h3 style="color:#8B2CFF;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px 0;">
                📋 Summary of Your Submission
              </h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:13px;color:#334155;">
                <tr>
                  <td style="padding:4px 0;width:35%;color:#64748b;font-weight:600;">${fieldLabel}:</td>
                  <td style="padding:4px 0;font-weight:700;color:#E91E63;">${escapeHtml(serviceOrDepartment)}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#64748b;font-weight:600;">Dedicated Desk:</td>
                  <td style="padding:4px 0;font-weight:700;color:#1e0d3d;">${teamName}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#64748b;font-weight:600;">Nationality:</td>
                  <td style="padding:4px 0;font-weight:600;">${escapeHtml(nationality || "N/A")}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#64748b;font-weight:600;">Phone / WhatsApp:</td>
                  <td style="padding:4px 0;font-weight:600;">${escapeHtml(phone)}</td>
                </tr>
                ${message ? `<tr><td style="padding:4px 0;color:#64748b;font-weight:600;vertical-align:top;">Your Message:</td><td style="padding:4px 0;font-style:italic;color:#475569;">"${escapeHtml(message)}"</td></tr>` : ""}
              </table>
            </div>
            <div style="background-color:#f8fafc;border-radius:14px;padding:20px;text-align:center;margin-bottom:24px;">
              <p style="font-size:13px;font-weight:700;color:#1e0d3d;margin:0 0 6px 0;">Want instant assistance or direct booking support?</p>
              <p style="font-size:12px;color:#64748b;margin:0 0 14px 0;">Connect directly with the <strong>${teamName}</strong> on WhatsApp:</p>
              <a href="https://wa.me/977${teamPhone}?text=Hello%20Trip%20Himalaya%20(${encodeURIComponent(serviceOrDepartment)})%2C%20I%20just%20submitted%20an%20inquiry%20regarding%20my%20travel%20plans." target="_blank" style="display:inline-block;background-color:#25D366;color:#ffffff;text-decoration:none;font-size:13px;font-weight:800;padding:12px 24px;border-radius:12px;letter-spacing:0.5px;box-shadow:0 4px 12px rgba(37,211,102,0.3);">
                💬 Chat with ${teamName} on WhatsApp (+977-${teamPhone})
              </a>
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
    </td></tr>
  </table>
</body>
</html>`;

              console.log(`[Email Plugin] Received inquiry from ${fullName} for ${serviceOrDepartment}`);

              // 1. Compulsory Admin Notification (NOTIFICATION_EMAIL)
              console.log(`[Email Plugin] Dispatching to Admin: ${adminNotificationEmail}`);
              await sendSmtpEmail({
                to: adminNotificationEmail,
                subject: subjectAdmin,
                htmlBody: adminHtml,
              });
              console.log(`[Email Plugin] Admin email sent successfully.`);

              // 2. Department Associated Team Notification
              if (
                teamEmail &&
                teamEmail.includes("@") &&
                teamEmail.toLowerCase() !== adminNotificationEmail.toLowerCase()
              ) {
                console.log(`[Email Plugin] Dispatching to Team: ${teamEmail}`);
                await sendSmtpEmail({
                  to: teamEmail,
                  subject: subjectAdmin,
                  htmlBody: adminHtml,
                }).catch((e: Error) =>
                  console.warn("[Email Plugin] Team notification error:", e)
                );
                console.log(`[Email Plugin] Team email sent successfully.`);
              }

              // 3. Customer Confirmation
              if (email && email.includes("@")) {
                console.log(`[Email Plugin] Dispatching to Customer: ${email}`);
                await sendSmtpEmail({
                  to: email,
                  subject: subjectUser,
                  htmlBody: userHtml,
                }).catch((e: Error) =>
                  console.warn("[Email Plugin] User confirmation error:", e)
                );
                console.log(`[Email Plugin] Customer email sent successfully.`);
              }

              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  success: true,
                  message: "Inquiry emails dispatched successfully!",
                  teamEmail,
                  teamPhone,
                })
              );
            } catch (err: any) {
              console.error("[Email Plugin] Error sending email:", err);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  success: false,
                  message: err?.message || "Failed to send email",
                })
              );
            }
          });
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), emailDevServerPlugin()],
});
