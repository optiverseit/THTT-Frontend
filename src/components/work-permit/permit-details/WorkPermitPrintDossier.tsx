import React from "react";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import Logo from "../../../assets/images/Logo.png";

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
}

const WorkPermitPrintDossier: React.FC<WorkPermitPrintDossierProps> = ({ country }) => {
  const refNumber = `THTT-WP-${country.country_code.toUpperCase()}-${new Date().getFullYear()}`;
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const ageTiers = [
    {
      tier: "Below 35 years (Ages 18–35)",
      insurance: "NPR 3,708",
      welfare: "NPR 1,500",
      ssf: "NPR 2,500",
      facilitation: "NPR 3,292",
      total: "NPR 11,000",
    },
    {
      tier: "35–50 years (Ages 35–50)",
      insurance: "NPR 4,929",
      welfare: "NPR 1,500",
      ssf: "NPR 2,500",
      facilitation: "NPR 3,571",
      total: "NPR 12,500",
    },
    {
      tier: "Above 51 years (Ages 51+)",
      insurance: "NPR 9,200",
      welfare: "NPR 1,500",
      ssf: "NPR 2,500",
      facilitation: "NPR 2,300",
      total: "NPR 15,500",
    },
  ];

  const processSteps = [
    {
      phase: "Phase 1",
      title: "Document Submission & Verification",
      desc: "Applicant submits original passport scan, valid job offer/employment visa copy, and recent MRP size photo.",
    },
    {
      phase: "Phase 2",
      title: "SSF & Mandatory Insurance Deposit",
      desc: "Deposit of Term Life Insurance (Myadi Bima) and Social Security Fund (SSF) fees into official government accounts.",
    },
    {
      phase: "Phase 3",
      title: "FEIMS Portal Entry & FEO Review",
      desc: "Application registered on the Government of Nepal FEIMS portal with document verification by Foreign Employment Office.",
    },
    {
      phase: "Phase 4",
      title: "Biometric & Security Clearance",
      desc: "Biometric verification in DOFE National Database and embassy verification match completed.",
    },
    {
      phase: "Phase 5",
      title: "Final Labor Approval (Shram Swikriti) Issued",
      desc: "Official digital QR-coded work permit certificate generated with live online verification on FEIMS portal.",
    },
  ];

  const reqDocs = [
    "MRP Size Photo (Recent - White background)",
    "Original Passport (Scan Copy with min 6 months validity)",
    "Valid Job Offer Letter / Employment Visa Copy",
    "Experience Certificates (If Required)",
    "Police Clearance Report (If Required)",
    "Insurance Registration – SSF / Welfare Fund (If Required)",
    "FEIMS Online Registration Slip (If Required)",
  ];

  const eligibilityList = [
    "Minimum age requirement: Must be at least 18 years of age",
    "Passport must hold minimum 6 months validity from departure date",
    "GAMCA / DOFE approved medical fitness certificate required",
    "Pre-departure orientation training certificate for first-time workers",
    "Self-declaration of contract wages and overseas employment terms",
  ];

  const includedList = [
    "Govt. Application & FEIMS Online Portal Entry",
    "FEO & DOFE Documentation Coordination",
    "High-resolution Document Scanning & Format Optimization",
    "SSF (Social Security Fund) & Insurance Deposit Help",
    "24/7 Dedicated Support & Live Tracking Updates",
  ];

  const policiesList = [
    "Non-refundable Govt. and Welfare fees once deposited into FEIMS portal",
    "FEO & Nepalese Embassy document verification is mandatory by law",
    "Biometric verification in DOFE National Database required",
    "Processing timeline subject to embassy and government server availability",
  ];

  const faqs = [
    {
      q: "How long does the work permit process take?",
      a: "Standard processing takes approximately 4 working days after all required documents and payments are submitted.",
    },
    {
      q: "What is the validity of the issued Work Permit?",
      a: "The labor permit (Shram Swikriti) is typically valid for 2 years corresponding to your overseas employment contract.",
    },
    {
      q: "Is Social Security Fund (SSF) registration mandatory?",
      a: "Yes, as per Government of Nepal regulations, all foreign employment applicants must be registered under SSF.",
    },
  ];

  return (
    <div
      className="hidden print:block relative"
      style={{
        fontFamily: "'Inter', Arial, sans-serif",
        fontSize: "9.5px",
        lineHeight: "1.45",
        color: "#1e293b",
        width: "100%",
        position: "relative",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
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
            transform: "rotate(-28deg)",
            fontSize: "38px",
            fontWeight: 900,
            color: "rgba(45, 19, 71, 0.06)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            lineHeight: 2.2,
            whiteSpace: "nowrap",
            textAlign: "center",
            mixBlendMode: "multiply",
          }}
        >
          Trip Himalaya Tours and Travels
        </div>
      </div>

      {/* ── 1. CORPORATE LETTERHEAD ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #2D1347 0%, #3B145C 50%, #4a1c7a 100%)",
          borderRadius: "10px 10px 0 0",
          padding: "12px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pageBreakInside: "avoid",
          breakInside: "avoid",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
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
              style={{ height: "60px", width: "auto", objectFit: "contain", display: "block" }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "15px",
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
                fontSize: "8px",
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

            {/* Address Line */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color: "#f3e8ff",
                fontSize: "8.5px",
                marginTop: "4px",
              }}
            >
              <MapPin size={9} color="#f472b6" style={{ flexShrink: 0 }} />
              <span>Airport, Shambhu Marg, Road No. 04, Kathmandu, Nepal</span>
            </div>

            {/* Contacts Line */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#f3e8ff",
                fontSize: "8px",
                marginTop: "2.5px",
                flexWrap: "nowrap",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                <Phone size={8.5} color="#f472b6" style={{ flexShrink: 0 }} />
                <span>+977-9851420882 / 01-5922697</span>
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                <Mail size={8.5} color="#f472b6" style={{ flexShrink: 0 }} />
                <span>triphimalayatt@gmail.com</span>
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                <Globe size={8.5} color="#f472b6" style={{ flexShrink: 0 }} />
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
            alignSelf: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "3.5px",
          }}
        >
          <div
            style={{
              fontSize: "8px",
              background: "rgba(233, 30, 99, 0.25)",
              color: "#fbcfe8",
              padding: "2.5px 8px",
              borderRadius: "4px",
              fontWeight: 700,
              border: "1px solid rgba(233, 30, 99, 0.4)",
              letterSpacing: "0.03em",
              textTransform: "uppercase",
            }}
          >
            Foreign Employment &amp; Work Permit Division
          </div>
          <div style={{ fontSize: "8.5px", color: "#e9d5ff", fontWeight: 600 }}>
            Ref: <span style={{ color: "#ffffff", fontWeight: 700 }}>{refNumber}</span>
          </div>
          <div style={{ fontSize: "8.5px", color: "#f3e8ff" }}>
            Date: {currentDate}
          </div>
        </div>
      </div>

      {/* Project brand accent strip */}
      <div
        style={{
          height: "4px",
          background: "linear-gradient(90deg, #E91E63 0%, #db2777 30%, #9333ea 70%, #2D1347 100%)",
          marginBottom: "10px",
        }}
      />

      {/* ── WORK PERMIT SUMMARY & OVERVIEW CARD ── */}
      <div
        style={{
          border: "1.5px solid #e9d5ff",
          borderRadius: "8px",
          padding: "10px 14px",
          marginBottom: "10px",
          background: "#fdf4ff",
          pageBreakInside: "avoid",
          breakInside: "avoid",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "15px", fontWeight: 900, color: "#2D1347", lineHeight: 1.2 }}>
              {country.country_name.toUpperCase()} - NEW LABOUR PERMIT (GOVERNMENT OF NEPAL / DOFE)
            </div>
            <div
              style={{
                fontSize: "8.5px",
                color: "#6b21a8",
                marginTop: "4px",
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  background: "#2D1347",
                  color: "#ffffff",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontWeight: 700,
                }}
              >
                📍 {country.country_name}
              </span>
              <span
                style={{
                  background: "#7c3aed",
                  color: "#ffffff",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontWeight: 700,
                }}
              >
                ⏱ 4 Working Days
              </span>
              <span
                style={{
                  background: "#9333ea",
                  color: "#ffffff",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontWeight: 700,
                }}
              >
                🛡 2 Years Valid Permit
              </span>
              <span
                style={{
                  background: "#c026d3",
                  color: "#ffffff",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontWeight: 700,
                }}
              >
                ⚡ Live FEIMS Online Tracking
              </span>
              <span
                style={{
                  background: "#E91E63",
                  color: "#ffffff",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontWeight: 700,
                }}
              >
                ★ 4.9 / 5.0 (1,000+ Successful Permits)
              </span>
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div
              style={{
                fontSize: "8px",
                color: "#7c3aed",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 700,
              }}
            >
              Starting From
            </div>
            <div style={{ fontSize: "16px", fontWeight: 900, color: "#2D1347" }}>NPR 11,000</div>
          </div>
        </div>
        <div
          style={{
            marginTop: "7px",
            paddingTop: "7px",
            borderTop: "1px solid #f3e8ff",
            fontSize: "9px",
            color: "#4a154b",
            lineHeight: "1.45",
          }}
        >
          <strong style={{ color: "#2D1347" }}>Official Overview: </strong>
          Official Government of Nepal Department of Foreign Employment (DOFE) verified labor approval (Shram Swikriti) processing for {country.country_name}. Facilitated with end-to-end documentation, SSF enrollment, mandatory insurance, biometric registration, FEO coordination, and live FEIMS status tracking.
        </div>
      </div>

      {/* ── SECTION 1: REGULATED GOVERNMENT & INSURANCE FEE SCHEDULE ── */}
      <div style={{ marginBottom: "10px", pageBreakInside: "avoid", breakInside: "avoid" }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "#2D1347",
            borderLeft: "3.5px solid #E91E63",
            paddingLeft: "7px",
            marginBottom: "5px",
          }}
        >
          1. Regulated Government, Insurance &amp; Welfare Fee Schedule
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "9px",
            border: "1px solid #e9d5ff",
          }}
        >
          <thead>
            <tr style={{ background: "linear-gradient(90deg, #2D1347, #3B145C)", color: "#ffffff" }}>
              <th style={{ padding: "6px 8px", textAlign: "left", fontWeight: 800, width: "30%" }}>
                Applicant Age Tier
              </th>
              <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 800, width: "17%" }}>
                Insurance (Myadi)
              </th>
              <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 800, width: "17%" }}>
                Welfare Fund
              </th>
              <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 800, width: "17%" }}>
                Social Security (SSF)
              </th>
              <th style={{ padding: "6px 8px", textAlign: "right", fontWeight: 800, width: "19%" }}>
                Total Regulated Fee
              </th>
            </tr>
          </thead>
          <tbody>
            {ageTiers.map((row, idx) => (
              <tr
                key={idx}
                style={{
                  background: idx % 2 === 0 ? "#ffffff" : "#faf5ff",
                  borderBottom: "1px solid #f3e8ff",
                }}
              >
                <td style={{ padding: "5px 8px", fontWeight: 700, color: "#2D1347" }}>{row.tier}</td>
                <td style={{ padding: "5px 8px", textAlign: "right", color: "#6b21a8" }}>{row.insurance}</td>
                <td style={{ padding: "5px 8px", textAlign: "right", color: "#6b21a8" }}>{row.welfare}</td>
                <td style={{ padding: "5px 8px", textAlign: "right", color: "#6b21a8" }}>{row.ssf}</td>
                <td style={{ padding: "5px 8px", textAlign: "right", fontWeight: 800, color: "#2D1347" }}>
                  {row.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: "8px", color: "#7c3aed", marginTop: "3px", fontWeight: 500 }}>
          * Rates include mandatory Term Life Insurance (Myadi Bima), Foreign Employment Welfare Fund, Social Security Fund (SSF), govt taxes, and professional agency facilitation charges.
        </div>
      </div>

      {/* ── SECTION 2: STEP-BY-STEP PROCESS TIMELINE ── */}
      <div style={{ marginBottom: "10px", pageBreakInside: "avoid", breakInside: "avoid" }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "#2D1347",
            borderLeft: "3.5px solid #E91E63",
            paddingLeft: "7px",
            marginBottom: "6px",
          }}
        >
          2. Step-by-Step Application &amp; Verification Process
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {processSteps.map((item, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #e9d5ff",
                borderRadius: "4px",
                padding: "6px 8px",
                background: "#faf5ff",
                display: "flex",
                gap: "8px",
                alignItems: "flex-start",
                pageBreakInside: "avoid",
                breakInside: "avoid",
              }}
            >
              <div
                style={{
                  background: "#2D1347",
                  color: "#ffffff",
                  fontSize: "8px",
                  fontWeight: 800,
                  padding: "2px 6px",
                  borderRadius: "3px",
                  flexShrink: 0,
                  textTransform: "uppercase",
                }}
              >
                {item.phase}
              </div>
              <div>
                <div style={{ fontSize: "9.5px", fontWeight: 800, color: "#2D1347" }}>{item.title}</div>
                <div style={{ fontSize: "8.5px", color: "#581c87", marginTop: "1px", lineHeight: "1.35" }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 3: REQUIRED DOCUMENTS & ELIGIBILITY CRITERIA (2 columns) ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          marginBottom: "10px",
          pageBreakInside: "avoid",
          breakInside: "avoid",
        }}
      >
        {/* Required Documents */}
        <div
          style={{
            border: "1.5px solid #d8b4fe",
            borderRadius: "6px",
            padding: "8px 10px",
            background: "#faf5ff",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "#2D1347",
              borderBottom: "1.5px solid #e9d5ff",
              paddingBottom: "3px",
              marginBottom: "5px",
            }}
          >
            3. Mandatory &amp; Required Documents
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {reqDocs.map((doc, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "5px",
                  fontSize: "8.5px",
                  color: "#581c87",
                }}
              >
                <span style={{ fontWeight: 900, color: "#E91E63", flexShrink: 0 }}>✓</span>
                <span style={{ lineHeight: "1.3" }}>{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div
          style={{
            border: "1.5px solid #e9d5ff",
            borderRadius: "6px",
            padding: "8px 10px",
            background: "#fdf4ff",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "#2D1347",
              borderBottom: "1.5px solid #e9d5ff",
              paddingBottom: "3px",
              marginBottom: "5px",
            }}
          >
            4. Applicant Eligibility Criteria
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {eligibilityList.map((rule, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "5px",
                  fontSize: "8.5px",
                  color: "#4a154b",
                }}
              >
                <span style={{ fontWeight: 900, color: "#E91E63", flexShrink: 0 }}>&bull;</span>
                <span style={{ lineHeight: "1.3" }}>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 4: WHAT'S INCLUDED & POLICIES (2 columns) ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          marginBottom: "10px",
          pageBreakInside: "avoid",
          breakInside: "avoid",
        }}
      >
        {/* Included Services */}
        <div
          style={{
            border: "1.5px solid #d8b4fe",
            borderRadius: "6px",
            padding: "8px 10px",
            background: "#faf5ff",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "#2D1347",
              borderBottom: "1.5px solid #e9d5ff",
              paddingBottom: "3px",
              marginBottom: "5px",
            }}
          >
            5. What&apos;s Included in Agency Facilitation
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {includedList.map((inc, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "5px",
                  fontSize: "8.5px",
                  color: "#581c87",
                }}
              >
                <span style={{ fontWeight: 900, color: "#E91E63", flexShrink: 0 }}>✓</span>
                <span style={{ lineHeight: "1.3" }}>{inc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Terms & Policies */}
        <div
          style={{
            border: "1.5px solid #fecdd3",
            borderRadius: "6px",
            padding: "8px 10px",
            background: "#fff1f2",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "#881337",
              borderBottom: "1.5px solid #fda4af",
              paddingBottom: "3px",
              marginBottom: "5px",
            }}
          >
            6. Regulatory Policies &amp; Terms
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {policiesList.map((pol, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "5px",
                  fontSize: "8.5px",
                  color: "#4c0519",
                }}
              >
                <span style={{ fontWeight: 900, color: "#be185d", flexShrink: 0 }}>&bull;</span>
                <span style={{ lineHeight: "1.3" }}>{pol}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 5: FREQUENTLY ASKED QUESTIONS ── */}
      <div style={{ marginBottom: "10px", pageBreakInside: "avoid", breakInside: "avoid" }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "#2D1347",
            borderLeft: "3.5px solid #E91E63",
            paddingLeft: "7px",
            marginBottom: "6px",
          }}
        >
          7. Important FAQs &amp; Essential Information
        </div>
        <div
          style={{
            border: "1.5px solid #e9d5ff",
            borderRadius: "6px",
            padding: "8px 10px",
            background: "#fdf4ff",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ fontSize: "8.5px", color: "#4a154b", lineHeight: "1.35" }}>
                <div style={{ fontWeight: 800, color: "#2D1347" }}>Q: {faq.q}</div>
                <div style={{ color: "#581c87", marginTop: "1px" }}>A: {faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CORPORATE FOOTER ── */}
      <div
        style={{
          background: "linear-gradient(90deg, #2D1347, #3B145C)",
          padding: "8px 14px",
          borderRadius: "6px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "8.5px",
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
