import React from "react";
import { MapPin, Phone, Mail, Globe, CheckCircle2, ShieldCheck, AlertCircle, HelpCircle } from "lucide-react";
import Logo from "../../../assets/images/Logo.png";
import { formatDescription } from "../../../utils/formatDescription";
import { DocumentRequirement, PermitFeeTier } from "./WorkPermitDetails";

interface CountryProps {
  id: number;
  country_code: string;
  country_name: string;
  iso_2: string;
  flag_code: string;
  short_description?: string;
  processing_days?: number;
  status?: string;
  display_order?: number;
}

interface WorkPermitPrintDossierProps {
  id: string;
  country: CountryProps;
  permitType?: string;
  documentRequirements?: DocumentRequirement[];
  feeTiers?: PermitFeeTier[];
}

const getPermitTypeLabel = (type?: string): string => {
  if (!type) return "Work Permit";
  switch (type.toUpperCase()) {
    case "NEW_LABOUR_PERMIT":
    case "NEW":
      return "New Work Permit";
    case "RENEWAL_PERMIT":
    case "RENEW":
      return "Renewal Work Permit";
    case "INDIVIDUAL_PERMIT":
    case "INDIVIDUAL":
      return "Individual Work Permit";
    case "LEGALIZATION_ATTESTATION":
    case "LEGALIZATION":
      return "Legalization / Attestation";
    default:
      return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
};

const WorkPermitPrintDossier: React.FC<WorkPermitPrintDossierProps> = ({
  country,
  permitType = "NEW_LABOUR_PERMIT",
  documentRequirements = [],
  feeTiers = [],
}) => {
  const refNumber = `THTT-WP-${country.country_code?.toUpperCase() || "INT"}-${new Date().getFullYear()}`;
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const permitLabel = getPermitTypeLabel(permitType);

  // Calculate starting from fee if fee tiers exist
  const validTotalFees = feeTiers
    .map((t) => Number(t.total_cost_npr))
    .filter((v) => Number.isFinite(v) && v > 0);
  const minStartingFee = validTotalFees.length > 0 ? Math.min(...validTotalFees) : null;

  // Real sections from AboutPermit.tsx
  const includedList = [
    "Govt. Application Filling",
    "FEO Coordination",
    "Document Scanning",
    "Insurance Help",
    "Online Status Tracking",
  ];

  const policiesList = [
    "Non-Refundable Govt. & Welfare Fees (Once deposited into FEIMS portal)",
    "FEO & Embassy Document Verification Mandatory",
    "Self-Declaration of Overseas Contract & Job Terms Required",
    "Biometric Verification in DOFE National Database",
  ];

  const termsList = [
    "Applicant must be minimum 18 years of age with valid passport",
    "Passport must have at least 6 months validity from departure date",
    "GAMCA / DOFE approved medical fitness report required",
    "Pre-departure orientation certificate required for first-time workers",
  ];

  const formattedOverview = country.short_description
    ? formatDescription(country.short_description)
    : "";

  const hasFeeTiers = feeTiers && feeTiers.length > 0;
  const hasDocRequirements = documentRequirements && documentRequirements.length > 0;

  return (
    <div
      className="hidden print:block relative"
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, Arial, sans-serif",
        fontSize: "8.5px",
        lineHeight: "1.38",
        color: "#1e293b",
        width: "100%",
        maxWidth: "100%",
        margin: "0 auto",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      <style>
        {`
          @media print {
            @page {
              size: A4 portrait;
              margin: 6mm 8mm;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .avoid-break {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
          }
        `}
      </style>

      {/* ── BACKGROUND WATERMARK ── */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 999,
        }}
      >
        <div
          style={{
            transform: "rotate(-26deg)",
            fontSize: "34px",
            fontWeight: 900,
            color: "rgba(45, 19, 71, 0.05)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          Trip Himalaya Tours and Travels
        </div>
      </div>

      {/* ── 1. CORPORATE LETTERHEAD ── */}
      <div
        className="avoid-break"
        style={{
          background: "linear-gradient(135deg, #2D1347 0%, #3B145C 50%, #4a1c7a 100%)",
          borderRadius: "8px 8px 0 0",
          padding: "10px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: "6px",
              padding: "4px 6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <img
              src={Logo}
              alt="Trip Himalaya"
              style={{ height: "48px", width: "auto", objectFit: "contain", display: "block" }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 900,
                color: "#ffffff",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
                margin: 0,
                lineHeight: 1.15,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Trip Himalaya Tours &amp; Travel Pvt. Ltd.
            </div>
            <div
              style={{
                fontSize: "7.5px",
                color: "#e9d5ff",
                fontWeight: 600,
                marginTop: "2px",
                lineHeight: 1.2,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              Govt. Approved Travel &amp; Foreign Employment Documentation Agency
            </div>

            {/* Address */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color: "#f3e8ff",
                fontSize: "8px",
                marginTop: "3px",
              }}
            >
              <MapPin size={8.5} color="#f472b6" style={{ flexShrink: 0 }} />
              <span>Airport, Shambhu Marg, Road No. 04, Kathmandu, Nepal</span>
            </div>

            {/* Contacts */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#f3e8ff",
                fontSize: "7.5px",
                marginTop: "2px",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                <Phone size={8} color="#f472b6" style={{ flexShrink: 0 }} />
                <span>+977-9851420882 / 01-5922697</span>
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                <Mail size={8} color="#f472b6" style={{ flexShrink: 0 }} />
                <span>triphimalayatt@gmail.com</span>
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                <Globe size={8} color="#f472b6" style={{ flexShrink: 0 }} />
                <span>www.triphimalaya.com.np</span>
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            textAlign: "right",
            flexShrink: 0,
            whiteSpace: "nowrap",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "2.5px",
          }}
        >
          <div
            style={{
              fontSize: "7.5px",
              background: "rgba(233, 30, 99, 0.25)",
              color: "#fbcfe8",
              padding: "2px 7px",
              borderRadius: "4px",
              fontWeight: 700,
              border: "1px solid rgba(233, 30, 99, 0.4)",
              letterSpacing: "0.03em",
              textTransform: "uppercase",
            }}
          >
            Foreign Employment &amp; Work Permit Division
          </div>
          <div style={{ fontSize: "8px", color: "#e9d5ff", fontWeight: 600 }}>
            Ref: <span style={{ color: "#ffffff", fontWeight: 700 }}>{refNumber}</span>
          </div>
          <div style={{ fontSize: "8px", color: "#f3e8ff" }}>
            Date: {currentDate}
          </div>
        </div>
      </div>

      {/* Brand accent line */}
      <div
        style={{
          height: "3.5px",
          background: "linear-gradient(90deg, #E91E63 0%, #db2777 30%, #9333ea 70%, #2D1347 100%)",
          marginBottom: "8px",
        }}
      />

      {/* ── 2. WORK PERMIT OVERVIEW BANNER CARD ── */}
      <div
        className="avoid-break"
        style={{
          border: "1.5px solid #e9d5ff",
          borderRadius: "6px",
          padding: "8px 12px",
          marginBottom: "8px",
          background: "#fdf4ff",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "13px", fontWeight: 900, color: "#2D1347", lineHeight: 1.2 }}>
              {country.country_name.toUpperCase()} – {permitLabel.toUpperCase()}
            </div>
            <div
              style={{
                fontSize: "7.5px",
                color: "#6b21a8",
                marginTop: "3.5px",
                display: "flex",
                gap: "5px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  background: "#2D1347",
                  color: "#ffffff",
                  padding: "1.5px 5.5px",
                  borderRadius: "3px",
                  fontWeight: 700,
                }}
              >
                📍 {country.country_name}
              </span>
              {country.processing_days ? (
                <span
                  style={{
                    background: "#7c3aed",
                    color: "#ffffff",
                    padding: "1.5px 5.5px",
                    borderRadius: "3px",
                    fontWeight: 700,
                  }}
                >
                  ⏱ {country.processing_days} Working Days
                </span>
              ) : null}
              <span
                style={{
                  background: "#9333ea",
                  color: "#ffffff",
                  padding: "1.5px 5.5px",
                  borderRadius: "3px",
                  fontWeight: 700,
                }}
              >
                🛡 2 Years Valid Permit
              </span>
              <span
                style={{
                  background: "#c026d3",
                  color: "#ffffff",
                  padding: "1.5px 5.5px",
                  borderRadius: "3px",
                  fontWeight: 700,
                }}
              >
                ⚡ Live FEIMS Online Tracking
              </span>
              <span
                style={{
                  background: "#E91E63",
                  color: "#ffffff",
                  padding: "1.5px 5.5px",
                  borderRadius: "3px",
                  fontWeight: 700,
                }}
              >
                ★ Verified Documentation
              </span>
            </div>
          </div>

          {/* Starting From Price (only if fee tiers are present) */}
          {minStartingFee !== null && (
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div
                style={{
                  fontSize: "7.5px",
                  color: "#7c3aed",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  fontWeight: 700,
                }}
              >
                Starting From
              </div>
              <div style={{ fontSize: "14px", fontWeight: 900, color: "#2D1347" }}>
                NPR {minStartingFee.toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Real Overview Description from Country (only if present) */}
        {formattedOverview && (
          <div
            style={{
              marginTop: "6px",
              paddingTop: "6px",
              borderTop: "1px solid #f3e8ff",
              fontSize: "8px",
              color: "#4a154b",
              lineHeight: "1.4",
            }}
          >
            <strong style={{ color: "#2D1347" }}>About {country.country_name} Permit: </strong>
            <span dangerouslySetInnerHTML={{ __html: formattedOverview }} />
          </div>
        )}
      </div>

      {/* ── 3. REGULATED FEE SCHEDULE (ONLY IF DATA AVAILABLE) ── */}
      {hasFeeTiers && (
        <div className="avoid-break" style={{ marginBottom: "8px" }}>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              color: "#2D1347",
              borderLeft: "3.5px solid #E91E63",
              paddingLeft: "6px",
              marginBottom: "4.5px",
            }}
          >
            1. Regulated Government, Insurance &amp; Welfare Fee Schedule
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "8px",
              border: "1px solid #e9d5ff",
            }}
          >
            <thead>
              <tr style={{ background: "linear-gradient(90deg, #2D1347, #3B145C)", color: "#ffffff" }}>
                <th style={{ padding: "4.5px 7px", textAlign: "left", fontWeight: 800, width: "32%" }}>
                  Applicant Age Tier
                </th>
                <th style={{ padding: "4.5px 7px", textAlign: "right", fontWeight: 800, width: "17%" }}>
                  Insurance (Myadi)
                </th>
                <th style={{ padding: "4.5px 7px", textAlign: "right", fontWeight: 800, width: "17%" }}>
                  Welfare Fund
                </th>
                <th style={{ padding: "4.5px 7px", textAlign: "right", fontWeight: 800, width: "17%" }}>
                  Social Security (SSF)
                </th>
                <th style={{ padding: "4.5px 7px", textAlign: "right", fontWeight: 800, width: "17%" }}>
                  Total Regulated Fee
                </th>
              </tr>
            </thead>
            <tbody>
              {feeTiers.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  style={{
                    background: idx % 2 === 0 ? "#ffffff" : "#faf5ff",
                    borderBottom: "1px solid #f3e8ff",
                  }}
                >
                  <td style={{ padding: "4px 7px", fontWeight: 700, color: "#2D1347" }}>
                    {row.age_group_label || `${row.min_age}${row.max_age ? `–${row.max_age}` : "+"} Years`}
                  </td>
                  <td style={{ padding: "4px 7px", textAlign: "right", color: "#6b21a8" }}>
                    NPR {Number(row.insurance_premium_npr || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "4px 7px", textAlign: "right", color: "#6b21a8" }}>
                    NPR {Number(row.welfare_fund_npr || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "4px 7px", textAlign: "right", color: "#6b21a8" }}>
                    NPR {Number(row.ssf_contribution_npr || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "4px 7px", textAlign: "right", fontWeight: 800, color: "#2D1347" }}>
                    NPR {Number(row.total_cost_npr || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: "7.5px", color: "#7c3aed", marginTop: "2.5px", fontWeight: 500 }}>
            * Rates include mandatory Term Life Insurance (Myadi Bima), Foreign Employment Welfare Fund, and Social Security Fund (SSF) under Government of Nepal regulations.
          </div>
        </div>
      )}

      {/* ── 4. DETAILS SECTION: DOCUMENTS, INCLUSIONS, POLICIES, TERMS ── */}
      <div
        className="avoid-break"
        style={{
          display: "grid",
          gridTemplateColumns: hasDocRequirements ? "1fr 1fr" : "1fr 1fr",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        {/* COLUMN 1: Real Requirement Documents & What's Included */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Real Requirement Documents (ONLY IF DATA AVAILABLE) */}
          {hasDocRequirements && (
            <div
              style={{
                border: "1.5px solid #d8b4fe",
                borderRadius: "6px",
                padding: "7px 9px",
                background: "#faf5ff",
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  color: "#2D1347",
                  borderBottom: "1.5px solid #e9d5ff",
                  paddingBottom: "3px",
                  marginBottom: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <CheckCircle2 size={10} color="#059669" />
                <span>Requirement Documents ({documentRequirements.length})</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2.5px" }}>
                {documentRequirements.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "4px",
                      fontSize: "8px",
                      color: "#4a154b",
                    }}
                  >
                    <span style={{ fontWeight: 900, color: "#E91E63", flexShrink: 0 }}>✓</span>
                    <span style={{ lineHeight: "1.3", fontWeight: doc.is_required ? 700 : 500 }}>
                      {doc.title}
                      {!doc.is_required && (
                        <span style={{ color: "#9ca3af", fontStyle: "italic", marginLeft: "3px" }}>
                          (Optional)
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What's Included (from AboutPermit.tsx) */}
          <div
            style={{
              border: "1.5px solid #d8b4fe",
              borderRadius: "6px",
              padding: "7px 9px",
              background: "#faf5ff",
            }}
          >
            <div
              style={{
                fontSize: "9px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
                color: "#2D1347",
                borderBottom: "1.5px solid #e9d5ff",
                paddingBottom: "3px",
                marginBottom: "4px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <ShieldCheck size={10} color="#E91E63" />
              <span>What&apos;s Included</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5px" }}>
              {includedList.map((inc, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "4px",
                    fontSize: "8px",
                    color: "#581c87",
                  }}
                >
                  <span style={{ fontWeight: 900, color: "#10b981", flexShrink: 0 }}>✓</span>
                  <span style={{ lineHeight: "1.3" }}>{inc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 2: Policy & Terms (from AboutPermit.tsx) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Policy */}
          <div
            style={{
              border: "1.5px solid #fecdd3",
              borderRadius: "6px",
              padding: "7px 9px",
              background: "#fff1f2",
            }}
          >
            <div
              style={{
                fontSize: "9px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
                color: "#881337",
                borderBottom: "1.5px solid #fda4af",
                paddingBottom: "3px",
                marginBottom: "4px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <AlertCircle size={10} color="#E91E63" />
              <span>Policy</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5px" }}>
              {policiesList.map((pol, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "4px",
                    fontSize: "8px",
                    color: "#4c0519",
                  }}
                >
                  <span style={{ fontWeight: 900, color: "#be185d", flexShrink: 0 }}>&bull;</span>
                  <span style={{ lineHeight: "1.3" }}>{pol}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div
            style={{
              border: "1.5px solid #e9d5ff",
              borderRadius: "6px",
              padding: "7px 9px",
              background: "#ffffff",
            }}
          >
            <div
              style={{
                fontSize: "9px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
                color: "#2D1347",
                borderBottom: "1.5px solid #e9d5ff",
                paddingBottom: "3px",
                marginBottom: "4px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <HelpCircle size={10} color="#E91E63" />
              <span>Terms &amp; Conditions</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5px" }}>
              {termsList.map((term, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "4px",
                    fontSize: "8px",
                    color: "#374151",
                  }}
                >
                  <span style={{ fontWeight: 900, color: "#E91E63", flexShrink: 0 }}>&bull;</span>
                  <span style={{ lineHeight: "1.3" }}>{term}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. CORPORATE FOOTER ── */}
      <div
        className="avoid-break"
        style={{
          background: "linear-gradient(90deg, #2D1347, #3B145C)",
          padding: "7px 12px",
          borderRadius: "6px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "7.5px",
          color: "#ffffff",
        }}
      >
        <div>
          <strong style={{ color: "#ffffff" }}>Trip Himalaya Tours &amp; Travel Pvt. Ltd.</strong> &bull; Registered in Nepal (Lic: 2490)
        </div>
        <div style={{ color: "#fce7f3" }}>
          Work Permit Division: +977-9851420882 &bull; triphimalayatt@gmail.com
        </div>
        <div style={{ fontWeight: 700, color: "#f472b6" }}>
          Official Computer-Generated Work Permit Dossier &bull; Page 1 of 1
        </div>
      </div>
    </div>
  );
};

export default WorkPermitPrintDossier;
