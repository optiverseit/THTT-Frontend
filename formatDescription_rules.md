# `formatDescription` — Complete Rule Reference

> **File:** [`src/utils/formatDescription.ts`](file:///d:/THTT/THTT/integration/src/utils/formatDescription.ts)  
> **Purpose:** Converts plain-text descriptions saved in the CMS/cPanel into properly styled HTML with visual hierarchy — automatically, without requiring any special editor or markdown.

---

## Pre-processing (before any rules run)

Before the rules run, the raw string is **normalized**:

| Step | What it does |
|------|--------------|
| `&nbsp;` / `\u00a0` → space | Cleans invisible non-breaking spaces |
| `<br>` → newline | Converts HTML line breaks to newlines |
| `</p>`, `</div>`, `</li>`, `</h1–6>` → newline | Block-close tags become line breaks |
| All remaining HTML tags stripped | Removes leftover `<span>`, `<strong>`, etc. |

> [!IMPORTANT]
> **Complex HTML pass-through:** If the raw text contains `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<td>`, `<th>`, `<iframe>`, `<svg>`, `<video>`, or `<audio>` — the **entire string is returned unchanged**. This handles rich WYSIWYG output.

---

## The 7 Formatting Rules (in priority order)

Rules are checked **top to bottom**. The first matching rule wins.

---

### Rule 1 — Main Section Heading (`A.` / `B.` / `C.`)

| | |
|---|---|
| **Pattern** | Line starts with a single uppercase letter followed by `.` or `)` and a space |
| **Regex** | `^[A-Z][\.)] ` |
| **Style** | `font-weight: 800`, color `#200B3B` (deep purple), `font-size: 0.95em`, `margin-top: 16px` |

**CMS input example:**
```
A. Eligibility Criteria
B. Required Documents
C. Processing Time
```

**Rendered as:** Large bold deep-purple headings — the top-level structure of a description.

---

### Rule 2 — Sub-section Heading (`i.` / `ii.` / `iii.` / `iv.`)

| | |
|---|---|
| **Pattern** | Line starts with a Roman numeral (i–xx) followed by `.` or `)` and a space |
| **Regex** | `^(i{1,3}\|iv\|vi{0,3}\|ix\|...)[\.\)] ` |
| **Style** | `font-weight: 700`, color `#4B1E7A` (purple accent), indented `14px`, `font-size: 0.89em` |

**CMS input example:**
```
i. Tourist Category
ii. Business Category
```

**Rendered as:** Medium bold purple sub-headings, indented under a main section.

---

### Rule 3 — Numbered List (`1.` / `2.` / `3.`)

| | |
|---|---|
| **Pattern** | Line starts with one or more digits followed by `.` or `)` and a space |
| **Regex** | `^\d+[\.\)] ` |
| **Style** | `<ol>` with `list-style-type: decimal`, left margin `28px` |
| **Smart label** | If item text has `Label – rest` or `Label: rest` format, the label is **bolded** automatically (see Rule 3b below) |

**CMS input example:**
```
1. Valid Passport
2. Completed visa application form
3. Recent passport-size photographs
```

---

### Rule 3b — Smart Label in List Items (bonus sub-rule)

Applies **inside** Rules 3, 4, and 5.

| | |
|---|---|
| **Pattern** | Item content matches `Short Label – rest` or `Short Label: rest` |
| **Regex** | `^([^–—\-\:]{2,50})\s*([–—\-]\|:)\s+(.*)$` |
| **Style** | Label part → `<strong font-weight:700 color:#1F2937>`, rest stays normal |

**CMS input example:**
```
1. Passport – Must be valid for at least 6 months
2. Photo: Recent white-background 35mm x 45mm
• Duration – 30 days from date of entry
```

**Rendered as:** `**Passport** – Must be valid for at least 6 months`

---

### Rule 4 — Lettered Sub-list (`a.` / `b.` / `c.`)

| | |
|---|---|
| **Pattern** | Line starts with a single **lowercase** letter followed by `.` or `)` and a space |
| **Regex** | `^[a-z][\.\)] ` |
| **Style** | `<ol>` with `list-style-type: lower-alpha`, deeper indent `42px` |

**CMS input example:**
```
a. Economy class ticket
b. Hotel booking confirmation
c. Bank statement (last 3 months)
```

**Rendered as:** Deeper-indented `a) b) c)` list inside a numbered item.

---

### Rule 5 — Bullet Points (`•` / `-` / `*`)

| | |
|---|---|
| **Pattern** | Line starts with `•`, `◉`, `○`, `-`, or `*` followed by a space |
| **Regex** | `^[\u2022\u25cf\u25cb\-\*] ` |
| **Style** | `<ul>` with `list-style-type: disc`, left margin `28px` |

**CMS input example:**
```
• Valid passport
- Hotel booking
* Return flight ticket
```

**Rendered as:** Standard bullet list.

---

### Rule 6 — Inline Title (short line ending with `:`)  ⬅ *newly added*

| | |
|---|---|
| **Pattern** | Line **ends with `:`** AND length ≤ 80 chars AND no mid-sentence punctuation AND not a URL |
| **Detection** | `trimmed.endsWith(":") && length ≤ 80 && no [.!?,] before colon && not http://` |
| **Style** | `font-weight: 800`, color `#2D1347` (dark purple), `margin-top: 14px`, `font-size: 0.9em` |

**CMS input example (from the image you showed):**
```
Required Documentation:
Purpose of Visit:
Eligibility Requirements:
Important Information:
```

**Rendered as:** Bold dark-purple section label, tighter spacing below it so the next paragraph reads as its body.

> [!NOTE]
> **Why it doesn't bold normal sentences ending in colon:**  
> The `looksLikeSentence` guard checks for mid-sentence punctuation (`.`, `!`, `?`, `,`) before the colon. So `"Please submit your documents, if available:"` would NOT be bolded because it has a comma.

---

### Rule 7 — Regular Paragraph (fallback)

| | |
|---|---|
| **Pattern** | Anything that didn't match Rules 1–6 |
| **Style** | `color: #4B5563`, `font-size: 0.875em`, `line-height: 1.75` |

Plain sentences are rendered as clean, readable paragraphs.

---

## Quick CMS Formatting Guide

```
A. Main Section Title          → Big bold dark-purple heading
i. Sub-section                 → Medium bold indented purple
1. Numbered item               → Decimal ordered list
1. Label: value                → Decimal list with bold label
a. Sub-item                    → Letter sub-list (deeper indent)
• Bullet item                  → Disc bullet list
- Bullet item                  → Disc bullet list (dash style)
Short Title:                   → Bold inline title (new Rule 6)
Regular sentence text.         → Normal paragraph
```

---

## Pages Where `formatDescription` Is Applied

| Page / Component | File | Field Rendered |
|---|---|---|
| **Visa Details** – About Visa section | [`VisaCountryDetailView.tsx`](file:///d:/THTT/THTT/integration/src/components/Service/VisaCountryDetailView.tsx) | `plan.aboutText` |
| **Visa Overview** | [`VisaOverview.tsx`](file:///d:/THTT/THTT/integration/src/components/VisaPackageDetail/VisaOverview.tsx) | `pkg.description` |
| **Insurance Plan Detail** – About section | [`InsurancePlanDetailView.tsx`](file:///d:/THTT/THTT/integration/src/components/Service/InsurancePlanDetailView.tsx) | `plan.aboutText` |
| **Insurance Overview** | [`InsuranceOverview.tsx`](file:///d:/THTT/THTT/integration/src/components/InsurancePackageDetail/InsuranceOverview.tsx) | `pkg.description` |
| **Travel Package Details Card** | [`PackageDetailsCard.tsx`](file:///d:/THTT/THTT/integration/src/components/TravelPackage/PackageDetailsCard.tsx) | `pkg.description` |
| **Travel Package Overview** | [`PackageOverview.tsx`](file:///d:/THTT/THTT/integration/src/components/TravelPackage/PackageDetail/PackageOverview.tsx) | `pkg.description` |
| **Travel Package Image Grid** | [`PackageImageGrid.tsx`](file:///d:/THTT/THTT/integration/src/components/TravelPackage/PackageDetail/PackageImageGrid.tsx) | `pkg.description` |
| **Hotel Overview** | [`HotelOverview.tsx`](file:///d:/THTT/THTT/integration/src/components/HotelPackageDetail/HotelOverview.tsx) | `pkg.description` |
| **Hotel Image Grid** | [`HotelImageGrid.tsx`](file:///d:/THTT/THTT/integration/src/components/HotelPackageDetail/HotelImageGrid.tsx) | `pkg.description` |
| **Hotel Booking Card** | [`HotelBookingCard.tsx`](file:///d:/THTT/THTT/integration/src/components/Service/HotelBookingCard.tsx) | `hotel.description` |
| **Vehicle Rental Detail** | [`VehicleRentalDetailContent.tsx`](file:///d:/THTT/THTT/integration/src/components/Service/VehicleRentalDetailContent.tsx) | `vehicle.description` |
| **Vehicle Overview** | [`VehicleOverview.tsx`](file:///d:/THTT/THTT/integration/src/components/VehiclePackageDetail/VehicleOverview.tsx) | `pkg.description` |
| **Trekking Detail** | [`TrekkingDetailContent.tsx`](file:///d:/THTT/THTT/integration/src/components/Service/TrekkingDetailContent.tsx) | `trek.description` |
| **Tours Detail** | [`ToursDetailContent.tsx`](file:///d:/THTT/THTT/integration/src/components/Service/ToursDetailContent.tsx) | `tour.description` |
| **Heli Service Detail** | [`packageheliservice.tsx`](file:///d:/THTT/THTT/integration/src/components/Service/packageheliservice.tsx) | `selectedTour.description` |
| **Travel Insurance Detail** | [`TravelInsuranceDetailContent.tsx`](file:///d:/THTT/THTT/integration/src/components/Service/TravelInsuranceDetailContent.tsx) | `plan.short_description \| plan.description` |
| **Work Permit Services** | [`PermitServices.tsx`](file:///d:/THTT/THTT/integration/src/components/work-permit/PermitServices.tsx) | `country.short_description` |
| **Work Permit About** | [`AboutPermit.tsx`](file:///d:/THTT/THTT/integration/src/components/work-permit/permit-details/AboutPermit.tsx) | `country.short_description` |
