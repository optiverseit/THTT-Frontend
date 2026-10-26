export interface TeamInfo {
  name: string;
  phone: string;
  email: string;
  purpose: string;
}

export const TEAMS_DATA: Record<string, TeamInfo> = {
  "Air Ticketing Team": {
    name: "Air Ticketing Team",
    phone: "9851420882",
    email: "dev.triphimalayatt@gmail.com",
    purpose: "Domestic & International Air Ticketing",
  },
  "Air Ticket": {
    name: "Air Ticketing Team",
    phone: "9851420882",
    email: "dev.triphimalayatt@gmail.com",
    purpose: "Domestic & International Air Ticketing",
  },
  "Tours & Holidays Team": {
    name: "Tours & Holidays Team",
    phone: "9851403761",
    email: "pradip.triphimalayatt@gmail.com",
    purpose: "Tour Packages & Customized Holidays Update",
  },
  "Tours": {
    name: "Tours & Holidays Team",
    phone: "9851403761",
    email: "pradip.triphimalayatt@gmail.com",
    purpose: "Tour Packages & Customized Holidays Update",
  },
  "Trekking & Adventure Team": {
    name: "Trekking & Adventure Team",
    phone: "9851403761",
    email: "pradip.triphimalayatt@gmail.com",
    purpose: "Trekking, Hiking & Adventure Activities Updated",
  },
  "Trekking": {
    name: "Trekking & Adventure Team",
    phone: "9851403761",
    email: "pradip.triphimalayatt@gmail.com",
    purpose: "Trekking, Hiking & Adventure Activities Updated",
  },
  "Adventure Activities": {
    name: "Trekking & Adventure Team",
    phone: "9851403761",
    email: "pradip.triphimalayatt@gmail.com",
    purpose: "Trekking, Hiking & Adventure Activities Updated",
  },
  "Hotel Booking Team": {
    name: "Hotel Booking Team",
    phone: "9851403761",
    email: "pradip.triphimalayatt@gmail.com",
    purpose: "Hotel Reservation & Accommodation",
  },
  "Hotel Booking": {
    name: "Hotel Booking Team",
    phone: "9851403761",
    email: "pradip.triphimalayatt@gmail.com",
    purpose: "Hotel Reservation & Accommodation",
  },
  "Visa & Documentation Team": {
    name: "Visa & Documentation Team",
    phone: "9851420882",
    email: "dev.triphimalayatt@gmail.com",
    purpose: "Visa, Documentation & Related Services Updated",
  },
  "Visa Services": {
    name: "Visa & Documentation Team",
    phone: "9851420882",
    email: "dev.triphimalayatt@gmail.com",
    purpose: "Visa, Documentation & Related Services Updated",
  },
  "Regular Route Team": {
    name: "Regular Route Team",
    phone: "9851356882",
    email: "samarpan.triphimalayatt@gmail.com",
    purpose: "Regular Route Transportation & Booking",
  },
  "Vehicle Rental Team": {
    name: "Vehicle Rental Team",
    phone: "9851356882",
    email: "samarpan.triphimalayatt@gmail.com",
    purpose: "Car, Jeep, Hiace, Bus & Airport Transfer",
  },
  "Vehicle Rental": {
    name: "Vehicle Rental Team",
    phone: "9851356882",
    email: "samarpan.triphimalayatt@gmail.com",
    purpose: "Car, Jeep, Hiace, Bus & Airport Transfer",
  },
  "Travel Insurance Team": {
    name: "Travel Insurance Team",
    phone: "9851403760",
    email: "bhishan.triphimalayatt@gmail.com",
    purpose: "Travel Insurance Services",
  },
  "Travel Insurance": {
    name: "Travel Insurance Team",
    phone: "9851403760",
    email: "bhishan.triphimalayatt@gmail.com",
    purpose: "Travel Insurance Services",
  },
  "Heli Services Team": {
    name: "Heli Services Team",
    phone: "9851420882",
    email: "dev.triphimalayatt@gmail.com",
    purpose: "Helicopter & Mountain Flight Services",
  },
  "Heli Services": {
    name: "Heli Services Team",
    phone: "9851420882",
    email: "dev.triphimalayatt@gmail.com",
    purpose: "Helicopter & Mountain Flight Services",
  },
  "Accounts & Billing Team": {
    name: "Accounts & Billing Team",
    phone: "9851403759",
    email: "actriphimalaya@gmail.com",
    purpose: "Payment, Invoice, Billing & Accounts",
  },
  "Customer Support Team": {
    name: "Customer Support Team",
    phone: "9851356882",
    email: "samarpan.triphimalayatt@gmail.com",
    purpose: "General Support, Assistance & Complaints",
  },
  "Other": {
    name: "Customer Support Team",
    phone: "9851356882",
    email: "samarpan.triphimalayatt@gmail.com",
    purpose: "General Support, Assistance & Complaints",
  },
};

export function getTeamInfo(key: string): TeamInfo {
  if (TEAMS_DATA[key]) return TEAMS_DATA[key];
  const lower = (key || "").toLowerCase();
  for (const [k, v] of Object.entries(TEAMS_DATA)) {
    if (lower.includes(k.toLowerCase()) || k.toLowerCase().includes(lower)) {
      return v;
    }
  }
  return {
    name: "Customer Support Team",
    phone: "9851356882",
    email: "samarpan.triphimalayatt@gmail.com",
    purpose: "General Support, Assistance & Complaints",
  };
}
