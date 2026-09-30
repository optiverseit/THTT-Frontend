export interface DocumentationProcessStep {
  step: number;
  title: string;
  desc: string;
}

export interface DocumentationFaq {
  question: string;
  answer: string;
}

export interface DocumentationItem {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  badge: string;
  badgeColor: string;
  shortDesc: string;
  aboutText: string;
  heroImage: string;
  galleryImages: string[];
  processingTime: string;
  validity: string;
  issuingAuthority: string;
  officeLocation: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  requiredDocuments: string[];
  processSteps: DocumentationProcessStep[];
  faqs: DocumentationFaq[];
  termsAndConditions: string[];
}

export const DOCUMENTATION_ITEMS: DocumentationItem[] = [
  {
    id: "police-report",
    name: "Police Report & Clearance",
    subtitle: "Official Police Character Certificate (PCC) verification and criminal record clearance.",
    category: "Legal & Character Clearance",
    badge: "Government Clearance",
    badgeColor: "bg-blue-600 text-white",
    shortDesc:
      "Official criminal record check, police clearance certificate, and background verification for overseas jobs, student visas, and foreign immigration.",
    aboutText: `
      <p style="text-align: justify; font-size: 15px; color: #374151;">
        The <strong>Police Character Certificate (PCC)</strong> issued by the <strong>Nepal Police Headquarters</strong> (Crime Investigation Department) serves as an official confirmation of an individual's criminal background record in Nepal. It is an indispensable legal document mandated by embassies, foreign employers, and international universities worldwide for visa processing, permanent residency (PR), work permits, and consular clearance.
      </p>

      <blockquote style="margin: 16px 0;">
        <span style="font-weight: 700; color: #2D1347; font-size: 15px;">Mandatory Embassies Requirement:</span>
        <span style="color: #4b5563;"> For countries like Canada, Australia, UAE, Qatar, and Schengen member states, police clearance must be less than 6 months old at the time of visa submission.</span>
      </blockquote>

      <h3 style="color: #2D1347; font-weight: 800; font-size: 17px; margin-top: 18px; margin-bottom: 8px;">Clearance Clearance Steps (Sequential Numbering)</h3>
      <ol style="padding-left: 24px; margin: 10px 0;">
        <li>
          <strong>Application Initiation & Citizenship Scrutiny</strong>
          <ol type="a" style="padding-left: 20px; margin-top: 4px;">
            <li>Verification of citizenship details against National Identity database</li>
            <li>Verification of passport bio-page and photograph quality</li>
          </ol>
        </li>
        <li>
          <strong>Centralized CID Record Verification</strong>
          <ol type="a" style="padding-left: 20px; margin-top: 4px;">
            <li>Cross-check against local district police station registers</li>
            <li>National criminal database verification by Nepal Police CID</li>
          </ol>
        </li>
        <li>
          <strong>Official Certificate Generation & Security Stamping</strong>
          <ol type="a" style="padding-left: 20px; margin-top: 4px;">
            <li>Digital QR seal generation for instant diplomatic verification</li>
            <li>Physical color seal endorsement from Police Headquarters, Naxal</li>
          </ol>
        </li>
      </ol>

      <h3 style="color: #2D1347; font-weight: 800; font-size: 17px; margin-top: 20px; margin-bottom: 8px;">Multi-view Document Checklist</h3>
      <ul style="padding-left: 24px; margin: 10px 0;">
        <li><span style="color: #E91E63; font-weight: 600;">Standard Domestic Candidates:</span>
          <ul style="padding-left: 20px; margin-top: 4px;">
            <li>Original Nepali Citizenship card (front and back)</li>
            <li>Valid Machine Readable Passport (MRP) or E-Passport copy</li>
            <li>Recent passport-sized photo with white background</li>
          </ul>
        </li>
        <li><span style="color: #2563eb; font-weight: 600;">Non-Resident Candidates (Residing Abroad):</span>
          <ul style="padding-left: 20px; margin-top: 4px;">
            <li>Copy of current foreign visa, residency permit, or work permit</li>
            <li>Passport entry/exit stamp verifying departure from Nepal</li>
          </ul>
        </li>
      </ul>

      <p style="text-align: center; margin-top: 20px;">
        <span style="font-size: 14px; font-weight: 700; color: #059669; background: #ecfdf5; padding: 6px 14px; border-radius: 9999px; border: 1px solid #a7f3d0;">
          ✓ Guaranteed 100% genuine clearance with verifiable digital QR code
        </span>
      </p>
    `,
    heroImage:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1400&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
    ],
    processingTime: "3 – 5 Business Days",
    validity: "6 Months from Date of Issue",
    issuingAuthority: "Nepal Police Headquarters, CID / Ministry of Home Affairs",
    officeLocation: "Naxal, Kathmandu / Online National Portal",
    highlights: [
      "Official Nepal Police Headquarters Verification",
      "Expedited processing for emergency visa & job deadlines",
      "Ministry of Foreign Affairs (MOFA) attestation readiness",
      "Certified digital QR-coded certificate issuance",
      "Complete assistance for candidates residing inside Nepal or abroad",
      "Direct home / office courier delivery across Nepal",
    ],
    inclusions: [
      "Comprehensive scrutiny of personal citizenship and passport records",
      "Online portal account setup and error-free dossier submission",
      "Liaison with local police stations for background verification checks",
      "Fingerprint biometrics appointment guidance and facilitation",
      "Issuance of QR-verifiable authentic digital certificate",
      "Physical color stamp collection from Nepal Police Headquarters",
      "MOFA consular department attestation coordination (optional add-on)",
      "Secure digital scan archiving in client dashboard",
    ],
    exclusions: [
      "Government-stipulated penalty fines for unresolved local court warrants",
      "Representation in active criminal legal trials or litigations",
      "Attestation fees charged separately by specific destination country embassies",
      "Third-party international courier postage outside Nepal (available at extra freight cost)",
    ],
    requiredDocuments: [
      "Clear color scan of Original Citizenship Card (Both Front & Back)",
      "Valid Passport Bio Page & Last Visa / Exit Stamp copies",
      "2 Recent Passport-sized Photographs (White background, 35mm x 45mm)",
      "Marriage Certificate copy (mandatory for female applicants if surname changed)",
      "Local Ward Office Temporary / Permanent Residence Recommendation",
      "Power of Attorney authorization (for applicants currently living abroad)",
    ],
    processSteps: [
      {
        step: 1,
        title: "Dossier Review & Submission",
        desc: "Our verification specialist conducts a thorough audit of your citizenship, passport, and photographs to eliminate discrepancies.",
      },
      {
        step: 2,
        title: "Online Application & Police Portal Filing",
        desc: "We register and submit your formal application into the centralized Nepal Police Clearance Verification portal with digital attachments.",
      },
      {
        step: 3,
        title: "Departmental Clearance & Fingerprint Matching",
        desc: "The CID criminal record database cross-references identity records and liaises with your permanent address district police division.",
      },
      {
        step: 4,
        title: "Issuance, Attestation & Delivery",
        desc: "Once verified, we retrieve the authenticated physical certificate, complete MOFA stamping if required, and deliver it safely to your hands.",
      },
    ],
    faqs: [
      {
        question: "Can I apply for a Nepal Police Report if I am currently outside Nepal?",
        answer:
          "Yes! We regularly assist Nepalese citizens living abroad. You will need to provide your passport copy, national ID, and a recent set of biometrics/fingerprints obtained from the nearest Nepalese Embassy or local certified notary.",
      },
      {
        question: "How long is the Police Character Certificate valid for visa purposes?",
        answer:
          "Most international embassies, immigration departments, and universities recognize the Nepal Police Clearance Certificate as valid for 6 months from its official issuance date.",
      },
      {
        question: "Does the certificate come with an online verifiable QR code?",
        answer:
          "Yes, modern Nepal Police Character Certificates feature an encrypted digital QR code and registration number that foreign embassies can instantly verify online.",
      },
    ],
    termsAndConditions: [
      "All applicant credentials and supporting records must be genuine and legally authentic.",
      "Any intentional misrepresentation or concealment of past legal records remains the sole legal liability of the applicant.",
      "Government clearance processing times are subject to official police working schedules and national holidays.",
      "Your documents are handled under strict confidentiality protocols and will never be shared with unapproved third parties.",
    ],
  },
  {
    id: "insurance-policies",
    name: "Insurance Policies",
    subtitle: "Comprehensive international travel medical coverage, mountain evacuation rescue, and policy certification.",
    category: "Medical & Travel Protection",
    badge: "Medical & Travel",
    badgeColor: "bg-pink-600 text-white",
    shortDesc:
      "Comprehensive international travel medical coverage, high-altitude mountain rescue, and policy certification for Schengen, USA, UK, and worldwide destinations.",
    aboutText:
      "Whether you are embarking on high-altitude Himalayan trekking, departing for overseas foreign employment, or visiting family abroad, comprehensive travel insurance is mandatory. Our insurance documentation desk partners with leading international underwriters to issue embassy-compliant policies that satisfy Schengen visa regulations (minimum €30,000 medical coverage), alpine emergency helicopter rescue up to 6,500m, trip cancellation, and overseas medical hospitalization.",
    heroImage:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1400&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=600&auto=format&fit=crop",
    ],
    processingTime: "Instant / Same Day (Within 2 Hours)",
    validity: "Customized to Your Exact Travel Duration (1 Day to 365 Days)",
    issuingAuthority: "Accredited International Underwriters & Nepal Insurance Authority",
    officeLocation: "Kathmandu / Digital Global Certificate Dispatch",
    highlights: [
      "Embassy-compliant Schengen, US, UK, and Australia travel coverage",
      "Cashless emergency medical hospitalization worldwide",
      "Helicopter search & rescue up to 6,000m+ for Himalayan trekkers",
      "Immediate digital policy certificate with verifiable barcode",
      "Coverage for trip delays, lost baggage, and repatriation",
      "Dedicated 24/7 emergency medical claim assistance hotline",
    ],
    inclusions: [
      "Direct coordination with insurance underwriters for customized policy limits",
      "Instant issuance of embassy-grade visa coverage certificate in PDF",
      "Emergency medical expenses reimbursement up to $50,000 - $100,000+",
      "Emergency medical evacuation and direct air ambulance dispatch authorization",
      "Baggage delay, lost luggage, and personal document loss indemnity",
      "24/7 worldwide emergency multilingual assistance helpline access",
      "Cashless claims liaison with top hospitals in Kathmandu and abroad",
    ],
    exclusions: [
      "Pre-existing chronic medical conditions not declared upon policy inception",
      "Self-inflicted injuries or reckless engagement in unpermitted extreme stunts",
      "Incidents occurring while under the direct influence of alcohol or non-prescribed narcotics",
      "Loss of uninsurable electronic high-value assets without supplementary coverage riders",
    ],
    requiredDocuments: [
      "Clear copy of Passport Bio Data Page",
      "Travel Itinerary, destination countries, and departure/return dates",
      "Nominee / Next of Kin full name, relationship, and emergency phone number",
      "Altitude trekking zone and peak permit details (for mountaineers)",
      "Medical fitness declaration for senior travelers over 65 years",
    ],
    processSteps: [
      {
        step: 1,
        title: "Requirement & Destination Evaluation",
        desc: "We analyze your travel itinerary, destination embassy regulations, and altitude exposure to recommend the perfect policy scope.",
      },
      {
        step: 2,
        title: "Personal Profile & Underwriting",
        desc: "We configure policy terms, traveler details, emergency contacts, and coverage sums directly with licensed insurance providers.",
      },
      {
        step: 3,
        title: "Instant Policy Generation",
        desc: "The policy document is issued with complete policy schedule, deductible terms, and 24/7 global emergency contact numbers.",
      },
      {
        step: 4,
        title: "Certificate Dispatch & Embassy Submission",
        desc: "Receive the official policy schedule and signed coverage certificate ready for direct submission to the visa consulate.",
      },
    ],
    faqs: [
      {
        question: "Does this insurance meet the requirements for a Schengen Visa?",
        answer:
          "Yes! All our Schengen travel insurance packages provide minimum €30,000 coverage, zero deductible on medical emergencies, repatriation coverage, and are officially accepted by European embassies.",
      },
      {
        question: "Can I get coverage for high-altitude trekking in Everest or Annapurna?",
        answer:
          "Absolutely. We offer specialized alpine riders covering emergency helicopter evacuation and high-altitude medical sickness up to 6,000+ meters.",
      },
      {
        question: "How quickly can I receive the policy certificate?",
        answer:
          "Digital policy certificates are generated and delivered within 1 to 2 hours upon receiving your traveler details.",
      },
    ],
    termsAndConditions: [
      "Policy coverage must be active prior to initial departure from your country of origin.",
      "Claims require original receipts, police reports (for lost baggage), or official hospital discharge summaries.",
      "Cancellation refunds are only applicable if visa rejection proof is provided prior to the policy start date.",
    ],
  },
  {
    id: "visa-informations",
    name: "Visa Informations & Dossiers",
    subtitle: "Complete consular dossier preparation, appointment booking, and embassy interview coaching.",
    category: "Consular & Embassy Dossier",
    badge: "Consular Services",
    badgeColor: "bg-purple-600 text-white",
    shortDesc:
      "Expert assistance for embassy visa dossiers, appointment scheduling, interview preparation, document translation, and consular attestation.",
    aboutText:
      "Navigating visa regulations requires rigorous adherence to embassy guidelines, flawless documentation, and meticulous itinerary preparation. Our experienced consular desk assists tourists, students, business delegates, and corporate travelers in compiling bulletproof visa dossiers. From round-trip flight reservations, verified hotel vouchers, sponsorship affidavits, statement of purpose (SOP) drafting, to mock interview coaching, we ensure your application represents the highest probability of approval.",
    heroImage:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1400&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop",
    ],
    processingTime: "2 – 7 Business Days",
    validity: "Depends on Destination Country & Visa Class (30 Days to 10 Years)",
    issuingAuthority: "Respective Foreign Embassies, Consulates & VFS Global Centers",
    officeLocation: "Kathmandu Consular Offices & Embassy Missions",
    highlights: [
      "Comprehensive embassy document checklist tailored to your profile",
      "Confirmed round-trip flight reservations and hotel booking vouchers",
      "Professional Cover Letter and Statement of Purpose (SOP) drafting",
      "VFS Global, TLScontact, and embassy biometric appointment booking",
      "Financial documentation audit & Chartered Accountant coordination",
      "One-on-one consular interview simulation and briefing",
    ],
    inclusions: [
      "Detailed profile evaluation and travel history risk assessment",
      "Step-by-step guidance on official online visa application portals (e.g. DS-160, Schengen)",
      "Preparation of formal travel itinerary and day-to-day destination tour plans",
      "Drafting of customized sponsorship letters and employer leave certificates (NOC)",
      "Verification of financial statements, tax clearance, and asset valuation filings",
      "Document indexing, color collation, and embassy-compliant folder presentation",
      "SMS and email status tracking alerts during consular processing",
    ],
    exclusions: [
      "Official visa application fees payable directly to the embassy or VFS Global",
      "Embassy biometric service fees and passport courier logistics surcharges",
      "Guarantees of visa grant (decision rests exclusively with consular visa officers)",
    ],
    requiredDocuments: [
      "Original Passport with minimum 6 months remaining validity & 2 blank pages",
      "Previous passports showing past travel history and entry stamps",
      "3 Passport-sized photos matching specific destination embassy specifications",
      "Personal & Company Bank Statements (Last 6 months) with branch seal",
      "Bank Balance Certificate indicating sufficient travel funds",
      "Employment Letter / Business Registration (PAN, Ward Registration, Tax Clearance)",
      "Invitation Letter / Conference registration / Family proof (if applicable)",
    ],
    processSteps: [
      {
        step: 1,
        title: "Profile Assessment & Document Checklist",
        desc: "We evaluate your financial standing, travel history, and purpose of visit to create a tailored document checklist.",
      },
      {
        step: 2,
        title: "Dossier Compilation & Form Filling",
        desc: "Our consular specialists prepare the online visa forms, itinerary, flight reservations, and personalized cover letters.",
      },
      {
        step: 3,
        title: "Appointment Booking & Fee Submission",
        desc: "We secure your biometric submission and interview appointment slot at VFS Global or the designated embassy.",
      },
      {
        step: 4,
        title: "Interview Coaching & Final Briefing",
        desc: "A dedicated visa consultant conducts a mock interview, reviews common consular questions, and prepares your file for submission.",
      },
    ],
    faqs: [
      {
        question: "Can you guarantee that my visa will be approved?",
        answer:
          "Under international law, the final granting of any visa rests entirely in the discretion of the embassy's consular visa officer. However, our meticulous dossier preparation and financial structuring maximize your approval rate and prevent common refusal triggers.",
      },
      {
        question: "Do I need to purchase actual flight tickets before getting the visa?",
        answer:
          "No! We provide genuine, verifiable round-trip flight reservations and hotel bookings that embassies accept for visa processing without you needing to purchase non-refundable air tickets in advance.",
      },
    ],
    termsAndConditions: [
      "Embassy processing durations are variable and entirely beyond third-party control.",
      "All documentation presented must be legitimate and verifiable by consular authorities.",
      "Visa consultation and processing fees are non-refundable once administrative work has commenced.",
    ],
  },
  {
    id: "work-permit-shram",
    name: "Online Shram / Labor Permit",
    subtitle: "Department of Foreign Employment (DOFE) online Shram registration, biometric verification, and government labor stickers.",
    category: "Government Labor Permitting",
    badge: "DOFE Certified",
    badgeColor: "bg-emerald-600 text-white",
    shortDesc:
      "Department of Foreign Employment (DOFE) online Shram registration, biometric verification, and government labor approval sticker.",
    aboutText:
      "Every Nepalese citizen traveling overseas for employment is legally required under the Foreign Employment Act to obtain an authorized Labor Approval (Shram Swikriti) from the Department of Foreign Employment (DOFE). Traveling without a valid Shram permit results in offloading at Tribhuvan International Airport immigration. We manage the entire digital FEIMS workflow—new individual labor permits, institutional approvals, renewals (Puna Shram), mandatory insurance policies, and Social Security Fund (SSF) registrations.",
    heroImage:
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1400&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=600&auto=format&fit=crop",
    ],
    processingTime: "24 – 48 Hours",
    validity: "Matches Employment Contract Duration (Typically 2 Years)",
    issuingAuthority: "Department of Foreign Employment (DOFE), Tahachal, Kathmandu",
    officeLocation: "FEIMS Central Online Portal / Kathmandu",
    highlights: [
      "Official FEIMS online individual and renewal labor permit processing",
      "Complete facilitation of Foreign Employment Insurance enrollment",
      "Government Social Security Fund (SSF) deposit and clearance",
      "Pre-departure orientation training verification assistance",
      "Airport immigration clearance guarantee and sticker generation",
      "Expedited turnaround for urgent departure flights",
    ],
    inclusions: [
      "FEIMS account creation and profile bio data digitization",
      "Work visa authentication check against Nepalese Embassy attestation lists",
      "Mandatory Foreign Employment Term Life Insurance policy issuance",
      "Welfare fund and SSF contribution deposit execution",
      "Coordination with DOFE labor officers for application review and endorsement",
      "Digital electronic Shram sticker retrieval with scannable QR verification",
      "Pre-flight immigration advisory and document checklist verification",
    ],
    exclusions: [
      "Mandatory government orientation course physical attendance (must be completed by candidate)",
      "Medical check fees at accredited GCC / GAMCA diagnostic clinics",
      "Fines arising from illegal overstays on previous foreign visas",
    ],
    requiredDocuments: [
      "Original Passport with minimum 1 year validity",
      "Valid Employment Visa / Entry Permit issued by destination country",
      "Signed Employment Contract / Offer Letter (Attested by Nepal Embassy if applicable)",
      "Mandatory Foreign Employment Term Life Insurance Certificate",
      "Pre-Departure Orientation Training Certificate",
      "Medical Fitness Certificate from accredited clinic",
      "Bank Account details in applicant's name in Nepal",
    ],
    processSteps: [
      {
        step: 1,
        title: "Contract & Visa Audit",
        desc: "We verify that your employment visa, salary, and company contract satisfy DOFE minimum wage and legal criteria.",
      },
      {
        step: 2,
        title: "Insurance & Welfare Fund Deposits",
        desc: "We process your mandatory life insurance policy and deposit contributions into the Foreign Employment Welfare Fund & SSF.",
      },
      {
        step: 3,
        title: "FEIMS Online Submission",
        desc: "All attested documents are uploaded to the FEIMS portal and queued for official government labor officer review.",
      },
      {
        step: 4,
        title: "Shram Sticker Issuance",
        desc: "Upon approval, your official digital Shram permit is downloaded, verified, and ready for airport immigration departure.",
      },
    ],
    faqs: [
      {
        question: "Can I renew my Shram permit online without visiting the labor office?",
        answer:
          "Yes! For renewal cases (Puna Shram) with valid visas, the entire process is conducted online via FEIMS without needing physical office presence.",
      },
      {
        question: "What happens if I try to travel abroad for work without Shram?",
        answer:
          "Immigration officers at Tribhuvan International Airport (TIA) strictly offload any passenger traveling on employment visas without an active Shram clearance.",
      },
    ],
    termsAndConditions: [
      "Applicants must possess legitimate work contracts compliant with Nepal foreign employment regulations.",
      "All government welfare fees and insurance premiums are mandatory by law and non-refundable upon submission.",
    ],
  },
  {
    id: "birth-relationship-verification",
    name: "Relationship & Vital Verification",
    subtitle: "Ward recommendations, certified English translations, and Ministry of Foreign Affairs (MOFA) attestation.",
    category: "Civil Status & Notarization",
    badge: "Civil Attestation",
    badgeColor: "bg-teal-600 text-white",
    shortDesc:
      "Ministry of Foreign Affairs (MOFA) attestation, certified English translation, relationship verification, and birth certificate legalization.",
    aboutText: `
      <p style="text-align: justify; font-size: 15px; color: #374151;">
        Civil status documents such as <strong>Relationship Certificates</strong>, <strong>Birth Certificates</strong>, <strong>Marriage Registrations</strong>, and <strong>Unmarried Certificates</strong> are essential proofs requested by foreign embassies for family reunification, dependent visas, student sponsorships, and immigration. In Nepal, these documents must follow a strict legal chain: issuance from local ward offices, notarized translation by an authorized translator, and final consular apostille/attestation by the Department of Consular Services under MOFA.
      </p>

      <div style="text-align: center; margin: 18px 0; padding: 12px 16px; background-color: #fdf2f8; border: 1px dashed #f472b6; border-radius: 14px;">
        <span style="font-size: 16px; font-weight: 700; color: #2D1347;">Important Verification Advisory:</span>
        <span style="font-size: 14px; color: #E91E63; font-weight: 600;"> MOFA attestation requires all local ward papers to bear the QR verification seal or official municipal stamp.</span>
      </div>

      <h3 style="color: #2D1347; font-weight: 800; font-size: 17px; margin-top: 16px; margin-bottom: 6px;">Key Document Verification Hierarchy</h3>
      <ol style="padding-left: 24px; margin: 10px 0;">
        <li>
          <strong style="color: #2D1347;">Stage 1: Local Municipal Authority (Ward Office)</strong>
          <ol type="a" style="padding-left: 20px; margin-top: 4px;">
            <li>Collection of certified kinship/vital registration in original Nepali script</li>
            <li>Ward Secretary signature and municipal stamp endorsement</li>
          </ol>
        </li>
        <li>
          <strong style="color: #2D1347;">Stage 2: Official Notarized English Translation</strong>
          <ol type="a" style="padding-left: 20px; margin-top: 4px;">
            <li>Bilingual legal format translation by authorized Notary Public</li>
            <li>Verification of applicant names, dates, and passport spellings</li>
          </ol>
        </li>
        <li>
          <strong style="color: #2D1347;">Stage 3: Consular Department Legalization (MOFA)</strong>
          <ol type="a" style="padding-left: 20px; margin-top: 4px;">
            <li>Digital token issuance and Department of Consular Services verification</li>
            <li>Affixation of official MOFA hologram sticker and consular seal</li>
          </ol>
        </li>
      </ol>

      <h3 style="color: #2D1347; font-weight: 800; font-size: 17px; margin-top: 20px; margin-bottom: 6px;">Essential Requirements & Multi-view Checklist</h3>
      <ul style="padding-left: 24px; margin: 10px 0;">
        <li><span style="color: #059669; font-weight: 600;">Primary Identification:</span> Original Citizenship and valid Passport of all related parties
          <ul style="padding-left: 20px; margin-top: 4px;">
            <li>Clear colored scans showing all 4 corners without glare</li>
            <li>Both father, mother, and child identification records if applying for child dependent visa</li>
          </ul>
        </li>
        <li><span style="color: #2563eb; font-weight: 600;">Vital Certificates:</span> Local Government birth, marriage, or family tree chart
          <ul style="padding-left: 20px; margin-top: 4px;">
            <li>Original Nepali vital certificate issued by the National Identity & Civil Registration Department</li>
            <li>English translated dossier verified by licensed Notary Advocate</li>
          </ul>
        </li>
      </ul>

      <p style="text-align: right; margin-top: 16px;">
        <span style="font-size: 13px; color: #6b7280; font-style: italic;">* Verified in accordance with Nepal Consular Attestation Guidelines.</span>
      </p>
    `,
    heroImage:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1400&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop",
    ],
    processingTime: "2 – 4 Business Days",
    validity: "Permanent / Valid indefinitely (Unless civil status changes)",
    issuingAuthority: "Local Ward Office, Notary Public Council & MOFA Consular Department",
    officeLocation: "Kathmandu Ward & Consular Services, Tripureshwor",
    highlights: [
      "End-to-end guidance from ward recommendation to MOFA stamping",
      "Certified legal English translations with official Notary Public seal",
      "Ministry of Foreign Affairs (MOFA) Consular Department online token & stamping",
      "Specialized handling for kinship verification and dependent visa sponsorship",
      "Name discrepancy affidavits and correction guidance",
    ],
    inclusions: [
      "Drafting of bilingual Ward verification application forms",
      "Professional English translation of Nepali vital registration records",
      "Notary Public Council verification and advocate seal endorsement",
      "Consular online portal appointment booking and challan payment",
      "In-person submission and retrieval of MOFA hologram attested papers",
      "Express courier dispatch of attested certificates",
    ],
    exclusions: [
      "Local municipal taxes and ward service fees charged by specific rural municipalities",
      "Secondary embassy legalization fees (e.g., German, Italian, or UAE embassy stamping)",
    ],
    requiredDocuments: [
      "Original Nepali Vital Registration Certificate (Birth / Marriage / Death / Kinship)",
      "Citizenship Certificates of the applicant and all declared family members",
      "Passport copies of all individuals listed on the relationship document",
      "Recent passport-sized photographs of each family member",
      "Ward office recommendation letter on official municipal letterhead",
    ],
    processSteps: [
      {
        step: 1,
        title: "Document Verification & Ward Review",
        desc: "We verify that names, dates of birth, and parents' details match consistently across all citizenship and passport records.",
      },
      {
        step: 2,
        title: "Certified Legal Translation",
        desc: "An authorized English translator and Notary Public creates a certified translation adhering to embassy formatting guidelines.",
      },
      {
        step: 3,
        title: "Consular Services Department (MOFA) Submission",
        desc: "We schedule the token slot and present your documents at MOFA Tripureshwor for official holographic attestation.",
      },
      {
        step: 4,
        title: "Final Review & Client Handover",
        desc: "We verify the seal and barcode, scan high-resolution digital copies, and hand over the certified originals.",
      },
    ],
    faqs: [
      {
        question: "Why does the embassy require a MOFA attestation on my birth certificate?",
        answer:
          "Foreign embassies cannot directly verify local ward office seals in Nepal. MOFA acts as the central government authority certifying the authenticity of local municipal signatures for foreign use.",
      },
    ],
    termsAndConditions: [
      "Discrepancies in English spelling of family names must be addressed before final MOFA submission.",
      "Translations must be executed strictly by certified Notary Public translators.",
    ],
  },
  {
    id: "academic-attestation",
    name: "Academic Attestation & NOC",
    subtitle: "Ministry of Education (MOE) No Objection Certificate (NOC), university equivalence, and embassy legalizations.",
    category: "Educational Credentials",
    badge: "MOE Verified",
    badgeColor: "bg-indigo-600 text-white",
    shortDesc:
      "Ministry of Education (MOE) No Objection Certificate (NOC), university transcript equivalence, and embassy legalizations.",
    aboutText:
      "For Nepalese students pursuing academic diplomas, undergraduate degrees, or postgraduate programs overseas, the Ministry of Education, Science and Technology (MOEST) No Objection Certificate (NOC) is legally compulsory. Without an approved NOC, Nepalese commercial banks cannot process international foreign currency tuition remittances, and airport immigration will not permit departure. We assist students with online NOC portal registration, Tribhuvan University equivalence certificates, and embassy transcript apostilles.",
    heroImage:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1400&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
    ],
    processingTime: "3 – 6 Business Days",
    validity: "Valid for the Specific Course & Academic Intake Listed",
    issuingAuthority: "Ministry of Education (MOEST) NOC Section, Sanothimi, Bhaktapur",
    officeLocation: "Online NOC Portal / Sanothimi, Bhaktapur",
    highlights: [
      "Official online MOEST NOC portal account setup and fast-track processing",
      "Foreign currency bank tuition remittance letter clearance",
      "Equivalence certification guidance for foreign / A-Level / IB degrees",
      "Transcript and degree attestation through Notary Public and MOFA",
      "Pre-departure student briefing and banking compliance documentation",
    ],
    inclusions: [
      "Scrutiny of university offer letters and conditional fee structures",
      "Conversion of academic transcripts and mark sheets into compliant PDF bundles",
      "Online NOC application submission and revenue voucher settlement",
      "Resolving portal queries, course code verification, and re-submissions",
      "Retrieval of digital signed NOC certificate with QR authentication",
      "Issuance of banking guidance letter for foreign exchange (FOREX) release",
    ],
    exclusions: [
      "University application and tuition deposit fees payable directly to foreign colleges",
      "Standard commercial bank FOREX commission fees on wire transfers",
    ],
    requiredDocuments: [
      "Unconditional Offer / Acceptance Letter from Foreign University",
      "Tuition Fee Structure breakdown and invoice on university letterhead",
      "Original Academic Transcripts & Character Certificates (SEE, +2, Bachelor's)",
      "Citizenship Certificate and valid Passport copies",
      "Equivalence Certificate from TU / CDC (if graduated from foreign board)",
    ],
    processSteps: [
      {
        step: 1,
        title: "Academic & Offer Letter Audit",
        desc: "We check university accreditation and verify your eligibility according to MOEST approved subject guidelines.",
      },
      {
        step: 2,
        title: "NOC Portal Registration & Submission",
        desc: "We file your profile in the MOEST digital portal with verified transcripts, university offer letters, and fee schedules.",
      },
      {
        step: 3,
        title: "Verification & Revenue Clearance",
        desc: "Education ministry officers review the application, course equivalence, and endorse the online clearance.",
      },
      {
        step: 4,
        title: "NOC Issuance & Bank Clearance",
        desc: "You receive the official digital NOC certificate enabling your bank to execute wire transfers for tuition fees.",
      },
    ],
    faqs: [
      {
        question: "Can I pay my foreign university tuition fees without an NOC?",
        answer:
          "No. Under Nepal Rastra Bank regulations, no commercial bank in Nepal is authorized to wire tuition fees abroad without an approved MOEST No Objection Certificate.",
      },
    ],
    termsAndConditions: [
      "The foreign educational institution must be recognized by the respective government's education board.",
      "The student must satisfy the minimum required academic GPA for the target program.",
    ],
  },
  {
    id: "medical-fit-to-travel",
    name: "Medical Fit-to-Travel Clearance",
    subtitle: "Authorized medical clinic fitness certificates, GAMCA / GCC slips, and Yellow Card vaccination clearance.",
    category: "Health & Quarantine Screening",
    badge: "Clinical Clearance",
    badgeColor: "bg-rose-600 text-white",
    shortDesc:
      "Authorized medical clinic fitness certificates, GAMCA / GCC slips, and Yellow Card vaccination clearance.",
    aboutText:
      "International health and quarantine regulations require travelers to prove medical fitness and freedom from communicable diseases. For high-altitude trekkers, airline travelers with medical conditions, and foreign employment workers bound for the Gulf (GAMCA), certified clinical documentation is non-negotiable. We assist in scheduling diagnostic screenings, securing authorized Fit-to-Fly medical certificates from civil aviation certified physicians, and processing official Yellow Fever vaccine cards.",
    heroImage:
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1400&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
    ],
    processingTime: "24 – 48 Hours",
    validity: "30 Days to 3 Months (Depending on Destination Regulation)",
    issuingAuthority: "Embassy-Accredited Medical Centers & Sukraraj Tropical Hospital (Teku)",
    officeLocation: "Kathmandu Accredited Diagnostic Centers",
    highlights: [
      "Appointment scheduling at authorized embassy & GAMCA medical clinics",
      "International Certificate of Vaccination or Prophylaxis (Yellow Card)",
      "Fit-to-Fly medical clearance certificates for commercial flights",
      "Comprehensive laboratory screening: blood, chest X-ray, and vision tests",
      "Expedited turnaround for urgent departure flights",
    ],
    inclusions: [
      "Clinic appointment booking and biometric pre-registration",
      "Review of pre-existing health history and doctor consultation coordination",
      "Collection and digital archiving of sealed laboratory test results",
      "Issuance of verified Fit-to-Travel clearance report signed by licensed physician",
      "Vaccine card tracking for international quarantine destinations",
    ],
    exclusions: [
      "Direct medical clinic diagnostic charges for specialized pathology tests",
      "Hospitalization expenses for treatments of identified medical conditions",
    ],
    requiredDocuments: [
      "Original Passport and 4 Passport-sized Photographs",
      "Destination country medical examination requisition form",
      "Previous vaccination history and current prescription records",
      "GAMCA online registration slip (for Gulf employment visas)",
    ],
    processSteps: [
      {
        step: 1,
        title: "Medical Center Appointment",
        desc: "We secure an immediate screening slot at an accredited embassy clinic or Teku hospital.",
      },
      {
        step: 2,
        title: "Clinical & Diagnostic Examination",
        desc: "You undergo routine vitals, chest radiography, blood tests, and physician evaluation.",
      },
      {
        step: 3,
        title: "Lab Analysis & Report Endorsement",
        desc: "Certified medical practitioners review test results and issue the formal fitness certificate.",
      },
      {
        step: 4,
        title: "Sealed Dossier & Online Registration",
        desc: "Results are uploaded to the embassy health portal (e.g. Wafid/GAMCA) and sealed copies delivered to you.",
      },
    ],
    faqs: [
      {
        question: "How long before my flight should I obtain a Fit-to-Fly certificate?",
        answer:
          "Most international airlines require medical Fit-to-Fly certificates to be issued within 7 to 10 days of your scheduled departure flight.",
      },
    ],
    termsAndConditions: [
      "Candidates must be physically present for mandatory biological specimen collection and clinical check-ups.",
    ],
  },
  {
    id: "financial-tax-clearance",
    name: "Financial & Tax Clearance",
    subtitle: "Bank balance certificates, CA audit statements, property valuation documents, and Inland Revenue tax clearance.",
    category: "Asset & Banking Verification",
    badge: "Financial Audit",
    badgeColor: "bg-amber-600 text-white",
    shortDesc:
      "Bank balance certificates, CA audit statements, property valuation documents, and Inland Revenue tax clearance.",
    aboutText:
      "Demonstrating financial solvency, verifiable source of income, and legitimate asset ownership is the single most critical factor in securing tourist, business, and study visas. Foreign visa officers must be convinced that the applicant possesses adequate financial resources to fund their travel and return home. We partner with licensed Chartered Accountants (CAs), registered property valuators, and legal consultants to compile comprehensive Net Worth and Financial Stability Dossiers.",
    heroImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1400&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
    ],
    processingTime: "2 – 3 Business Days",
    validity: "Statements Valid for 3 Months from Bank Date of Issue",
    issuingAuthority: "Commercial Banks (Class A), Chartered Accountants & Inland Revenue Dept",
    officeLocation: "Kathmandu Financial & Legal Centers",
    highlights: [
      "Bank Balance Certificate and 6-month transaction statement verification",
      "Chartered Accountant (CA) certified Net Worth Summary and valuation reports",
      "Property Valuation Certificates for land and buildings (Lalpurja)",
      "Inland Revenue Department (IRD) PAN and Tax Clearance Certificate guidance",
      "Sponsorship affidavits, business profit & loss statement structuring",
      "Consular financial dossier indexing for maximum visa officer clarity",
    ],
    inclusions: [
      "Thorough review of cash flows, deposits, and income source narratives",
      "Drafting of legal Sponsorship Affidavits and Family Financial Commitments",
      "Coordination with registered property evaluation engineers for asset appraisals",
      "CA firm audit, net worth computation, and official member seal attestation",
      "Retrieval and verification of digital tax clearance vouchers from IRD",
      "Assembly into a structured, indexed financial dossier ready for embassy submission",
    ],
    exclusions: [
      "Direct bank issuance fees charged for balance certificates and statement printouts",
      "Government property registration taxes and municipal valuation fees",
    ],
    requiredDocuments: [
      "Class A Bank Statements (Last 6 Months) with branch seal and authorized signature",
      "Official Bank Balance Certificate in NPR and USD equivalence",
      "PAN Card copies of applicant and financial sponsors",
      "Tax Clearance Receipts for the last 1 to 3 fiscal years",
      "Land Ownership Certificates (Lalpurja), blue print maps, and char-killa documents",
      "Salary slips, employment contracts, or company registration certificates",
    ],
    processSteps: [
      {
        step: 1,
        title: "Asset & Banking Assessment",
        desc: "We analyze your liquid savings, property holdings, and income sources against the financial threshold required by the embassy.",
      },
      {
        step: 2,
        title: "Property & Valuation Appraisal",
        desc: "Licensed property evaluators assess real estate assets and compute certified fair market values.",
      },
      {
        step: 3,
        title: "Chartered Accountant (CA) Audit",
        desc: "A licensed CA firm audits supporting records, prepares a certified Net Worth Statement, and affixes official credentials.",
      },
      {
        step: 4,
        title: "Final Dossier Compilation",
        desc: "All statements, tax clearances, and affidavits are bound and indexed for submission to the visa consulate.",
      },
    ],
    faqs: [
      {
        question: "How much bank balance do I need to show for a tourist visa?",
        answer:
          "The recommended balance depends on the destination and duration of stay. Generally, embassies expect to see sufficient funds to cover round-trip flights, accommodations, daily expenses, plus an additional contingency safety margin (typically $3,000 - $10,000+ depending on destination).",
      },
    ],
    termsAndConditions: [
      "All bank statements must be authentic documents issued directly by licensed Class 'A' financial institutions.",
      "Net worth assessments are conducted strictly on legally registered, verifiable assets.",
    ],
  },
];
