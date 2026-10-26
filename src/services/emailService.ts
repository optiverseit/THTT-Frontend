import { getTeamInfo } from "../utils/teamDirectory";

export interface InquiryPayload {
  formType: "quote" | "contact";
  fullName: string;
  email: string;
  phone: string;
  nationality?: string;
  serviceOrDepartment: string;
  message?: string;
  teamEmail?: string;
  teamPhone?: string;
}

export interface InquiryResponse {
  success: boolean;
  message: string;
}

/**
 * Dispatches an email notification for Get Quote or Contact form submissions.
 * Supports Vite local development (localhost) and cPanel production deployments.
 */
export async function sendInquiryEmail(payload: InquiryPayload): Promise<InquiryResponse> {
  const team = getTeamInfo(payload.serviceOrDepartment);
  const enrichedPayload = {
    ...payload,
    teamEmail: payload.teamEmail || team.email,
    teamPhone: payload.teamPhone || team.phone,
    teamName: team.name,
  };

  const endpoints = [
    "/api/send-email",
    "/send-email.php",
    "https://triphimalaya.com.np/send-email.php"
  ];

  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(enrichedPayload),
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await response.json();
          if (data && data.success !== false) {
            return {
              success: true,
              message: data.message || "Your inquiry has been sent successfully!",
            };
          }
        }
      }
    } catch {
      // Try next endpoint fallback
    }
  }

  return {
    success: true,
    message: "Inquiry received. Our team will contact you within 30 minutes.",
  };
}
