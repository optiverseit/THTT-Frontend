export interface WorkPermitDocument {
  id: string | number;
  title: string;
  is_required?: boolean;
  description?: string;
}

export interface WorkPermitType {
  id: string;
  modal_type_value: string;
  name: string;
  days: string;
  validity?: string;
  base_fee_npr: number;
  fee_adjustment_npr?: number; // Adjustment relative to base age tier, or fixed fee
  documents: (string | WorkPermitDocument)[];
}

export const DEFAULT_WORK_PERMIT_TYPES: WorkPermitType[] = [
  {
    id: "new_work_permit",
    modal_type_value: "new_labour_permit",
    name: "New Work permit",
    days: "5 - 7 Days",
    validity: "2 Years",
    base_fee_npr: 8000,
    fee_adjustment_npr: 0,
    documents: [
      "Original Passport (Scan Copy)",
      "Valid Job Offer Letter/Visa Copy",
      "Experience Certificates (if applicable)",
      "MRP Size Photo (Recent)",
      "Police Clearance Report (if required)",
      "Medical Fitness Report (GAMCA/DOFE)",
      "Pre-departure Orientation Training Certificate",
    ],
  },
  {
    id: "renewal_work_permit",
    modal_type_value: "renewal_permit",
    name: "renewal work permit",
    days: "3 - 5 Days",
    validity: "1 - 2 Years",
    base_fee_npr: 6500,
    fee_adjustment_npr: -1500,
    documents: [
      "Current Passport (Scan Copy)",
      "Previous Labour Permit (Old Shram Sticker/Copy)",
      "Valid Renewal Visa / QID / Iqama / Residence Permit",
      "Valid Employment Contract / Salary Slip",
      "Recent MRP Size Photo",
      "Return Air Ticket (if applicable)",
    ],
  },
  {
    id: "individual_permit",
    modal_type_value: "individual_permit",
    name: "Individual permit",
    days: "7 - 10 Days",
    validity: "2 Years",
    base_fee_npr: 9000,
    fee_adjustment_npr: 1000,
    documents: [
      "Original Passport with Valid Entry Visa",
      "Individual Work Visa / Sponsorship Letter",
      "Employer Verification & Agreement Copy",
      "MRP Size Photo (Recent)",
      "Self-Declaration Form (FEIMS Overseas Contract)",
      "Skills & Training Certificate (if applicable)",
    ],
  },
];
