/**
 * Dynamic Document Requirement Field Definition
 * Architected so that all fields and rules can later be fetched dynamically
 * from the backend API, exactly like Visa and Insurance requirements.
 */
export interface DocumentRequirementField {
  id: string;
  name: string;
  title?: string;
  description: string;
  is_required: boolean;
  supported_formats: string[];
  max_size_mb: number;
}

export interface DocumentationFormFieldConfig {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type?: "text" | "email" | "tel" | "textarea" | "select";
  required?: boolean;
}

export const DEFAULT_DOCUMENTATION_FORM_FIELDS: Record<string, DocumentationFormFieldConfig> = {
  fullName: {
    id: "fullName",
    name: "fullName",
    label: "Full Legal Name",
    placeholder: "Enter your full name",
    required: true,
  },
  nationality: {
    id: "nationality",
    name: "nationality",
    label: "Nationality",
    placeholder: "Enter your country",
    required: true,
  },
  email: {
    id: "email",
    name: "email",
    label: "Email Address",
    placeholder: "Enter your email address",
    type: "email",
    required: true,
  },
  phone: {
    id: "phone",
    name: "phone",
    label: "Phone / WhatsApp Number",
    placeholder: "Enter your phone number",
    type: "tel",
    required: true,
  },
  idNumber: {
    id: "idNumber",
    name: "idNumber",
    label: "Citizenship / Passport / National ID",
    placeholder: "Enter ID or passport number",
    required: true,
  },
  destinationCountry: {
    id: "destinationCountry",
    name: "destinationCountry",
    label: "Destination Country / Purpose",
    placeholder: "Enter your country",
    required: true,
  },
};

export interface DocumentationServiceOption {
  id: number | string;
  title: string;
  subtitle?: string;
  standardPriceNpr: number;
  expressPriceNpr: number;
  turnaroundStandard: string;
  turnaroundExpress: string;
}

export const DEFAULT_DOCUMENTATION_SERVICES: DocumentationServiceOption[] = [
  {
    id: 1,
    title: "Police Clearance Certificate (PCC)",
    subtitle: "Nepal Police character verification for employment, study & PR.",
    standardPriceNpr: 3500,
    expressPriceNpr: 6000,
    turnaroundStandard: "3–5 Business Days",
    turnaroundExpress: "24–48 Hours",
  },
  {
    id: 2,
    title: "Embassy Attestation & Legalization",
    subtitle: "MoFA and foreign diplomatic embassy consular authentication.",
    standardPriceNpr: 5000,
    expressPriceNpr: 8500,
    turnaroundStandard: "4–6 Business Days",
    turnaroundExpress: "48 Hours",
  },
  {
    id: 3,
    title: "Medical & Health Clearance",
    subtitle: "Accredited diagnostic appointments & health screening clearance.",
    standardPriceNpr: 4000,
    expressPriceNpr: 7000,
    turnaroundStandard: "2–3 Business Days",
    turnaroundExpress: "24 Hours",
  },
  {
    id: 4,
    title: "Relationship & Marital Attestation",
    subtitle: "Ward verification, English translation & notary certification.",
    standardPriceNpr: 3000,
    expressPriceNpr: 5500,
    turnaroundStandard: "3–4 Business Days",
    turnaroundExpress: "24–48 Hours",
  },
  {
    id: 5,
    title: "Financial & Tax Audit Clearances",
    subtitle: "CA bank balance certificate, valuation & source of funds dossiers.",
    standardPriceNpr: 4500,
    expressPriceNpr: 7500,
    turnaroundStandard: "3–5 Business Days",
    turnaroundExpress: "24–48 Hours",
  },
  {
    id: 6,
    title: "Fast-Track e-Passport Assistance",
    subtitle: "DoP Tripureshwor appointment token & document checklist review.",
    standardPriceNpr: 2500,
    expressPriceNpr: 4500,
    turnaroundStandard: "2–3 Business Days",
    turnaroundExpress: "Same-Day / 24 Hours",
  },
  {
    id: 7,
    title: "Custom Embassy / Legal Clearance",
    subtitle: "Specialized diplomatic clearances, translations & expedited cases.",
    standardPriceNpr: 4000,
    expressPriceNpr: 7000,
    turnaroundStandard: "3–5 Business Days",
    turnaroundExpress: "24–48 Hours",
  },
];

/**
 * Standard default document requirements.
 * These can later be replaced/extended dynamically by an API endpoint.
 */
export const DEFAULT_DOCUMENT_REQUIREMENTS: DocumentRequirementField[] = [
  {
    id: "id_document",
    name: "Government ID / Passport Copy",
    description: "Clear colored scan of Nepali Citizenship, National ID, or valid Passport (Bio-data page).",
    is_required: true,
    supported_formats: ["PDF", "JPG", "JPEG", "PNG", "WEBP"],
    max_size_mb: 5,
  },
  {
    id: "original_document",
    name: "Original Document to Verify / Attest",
    description: "Scan of the degree certificate, police dossier, marriage certificate, or document needing clearance.",
    is_required: true,
    supported_formats: ["PDF", "JPG", "JPEG", "PNG", "WEBP"],
    max_size_mb: 10,
  },
  {
    id: "passport_photo",
    name: "Recent Passport-Sized Photograph",
    description: "Front-facing colored photograph with light/white background taken within the last 6 months.",
    is_required: true,
    supported_formats: ["JPG", "JPEG", "PNG", "WEBP"],
    max_size_mb: 3,
  },
  {
    id: "embassy_letter",
    name: "Embassy / Employer / Institutional Letter",
    description: "Job offer letter, university admission, embassy checklist, or sponsorship letter (if applicable).",
    is_required: false,
    supported_formats: ["PDF", "JPG", "JPEG", "PNG", "WEBP"],
    max_size_mb: 5,
  },
  {
    id: "previous_clearances",
    name: "Previous Clearances / Notary Translation",
    description: "Any prior verification slip, official English translation, or annexure documents (optional).",
    is_required: false,
    supported_formats: ["PDF", "JPG", "JPEG", "PNG", "WEBP"],
    max_size_mb: 5,
  },
];
