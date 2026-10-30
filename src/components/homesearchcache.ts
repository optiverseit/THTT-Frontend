import React from "react";
import {
  Plane,
  Map,
  Mountain,
  Activity,
  Bed,
  Shield,
  Heart,
  Car,
  Wind,
  FileText,
} from "lucide-react";
import {
  getPackages,
  getHotels,
  getAllVehicles,
  getVisaCategories,
  getGroupedWorkPermitCountries,
  getInsurancePlans,
  getAllDocuments,
} from "../api/BackendApi";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SearchResult {
  id: string | number;
  label: string;
  sublabel?: string;
  type:
    | "package"
    | "service"
    | "hotel"
    | "vehicle"
    | "visa"
    | "insurance"
    | "heli"
    | "trekking"
    | "activity"
    | "tour";
  route: string;
  icon: React.ElementType;
}

// ─── Icon and Badge Mappings ──────────────────────────────────────────────────

export const SERVICE_ICON_MAP: Record<string, React.ElementType> = {
  "air-ticket": Plane,
  tours: Map,
  activities: Activity,
  trekking: Mountain,
  "hotel-booking": Bed,
  "visa-services": Shield,
  "travel-insurance": Heart,
  "vehicle-rental": Car,
  "heli-services": Wind,
  "work-permit": FileText,
  documentation: FileText,
};

export const TYPE_COLOR_MAP: Record<string, string> = {
  package: "bg-pink-100 text-pink-600",
  service: "bg-purple-100 text-purple-600",
  hotel: "bg-amber-100 text-amber-600",
  vehicle: "bg-green-100 text-green-600",
  visa: "bg-indigo-100 text-indigo-600",
  insurance: "bg-rose-100 text-rose-600",
  heli: "bg-cyan-100 text-cyan-600",
  trekking: "bg-emerald-100 text-emerald-600",
  activity: "bg-orange-100 text-orange-600",
  tour: "bg-violet-100 text-violet-600",
};

export const TYPE_LABEL_MAP: Record<string, string> = {
  package: "Package",
  service: "Service",
  hotel: "Hotel",
  vehicle: "Vehicle",
  visa: "Visa",
  insurance: "Insurance",
  heli: "Heli Tour",
  trekking: "Trekking",
  activity: "Activity",
  tour: "Tour",
};

export const QUICK_SEARCHES = [
  "Thailand Visa",
  "UAE Work Permit",
  "Tours",
  "Trekking",
  "Hotel",
  "Vehicle",
  "Air Ticket",
];

// ─── Cache Keys & Configuration ───────────────────────────────────────────────

export const SEARCH_STORAGE_KEY = "thtt_live_search_index_v5";
export const SEARCH_STORAGE_TIMESTAMP_KEY = "thtt_live_search_timestamp_v5";
export const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL

// ─── Verified Live Database Items ─────────────────────────────────────────────
// Only real verified live database items. Zero mock data. Exact 1-to-1 match.

export const INITIAL_DATABASE_ITEMS: SearchResult[] = [
  // Verified live Visa Categories in Database
  {
    id: "visa-1",
    label: "Thailand – Tourist Visa",
    sublabel: "Authorized Visa Counseling & e-Visa Application Support for Nepali Citizens",
    type: "visa" as const,
    route: "/visa-details/1",
    icon: Shield,
  },
  {
    id: "visa-2",
    label: "Thailand – Business Visa",
    sublabel: "Authorized Visa Counseling & E-Visa Application Support for Nepali Citizens",
    type: "visa" as const,
    route: "/visa-details/2",
    icon: Shield,
  },

  // Verified live Work Permit in Database (Exact 1-to-1 match with live DB)
  {
    id: "permit-1-RENEWAL_PERMIT",
    label: "United Arab Emirates – Renewal Permit",
    sublabel: "Labour Approval & Work Permit Renewal for UAE (Dubai / Abu Dhabi)",
    type: "service" as const,
    route: "/permit-details/1?permitType=RENEWAL_PERMIT",
    icon: FileText,
  },
];

// Helper to resolve the correct Lucide icon based on type
export const resolveIcon = (type: SearchResult["type"]): React.ElementType => {
  switch (type) {
    case "visa":
      return Shield;
    case "hotel":
      return Bed;
    case "vehicle":
      return Car;
    case "insurance":
      return Heart;
    case "trekking":
      return Mountain;
    case "activity":
      return Activity;
    case "heli":
      return Wind;
    case "tour":
      return Map;
    default:
      return FileText;
  }
};

// ─── 0ms Initial Cache Reader ─────────────────────────────────────────────────
// Reads localStorage synchronously on initial render. Zero wait time.
export const getCachedSearchItems = (): SearchResult[] => {
  if (typeof window === "undefined") {
    return [...INITIAL_DATABASE_ITEMS];
  }
  try {
    const raw = localStorage.getItem(SEARCH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item: any) => ({
          ...item,
          icon: resolveIcon(item.type),
        }));
      }
    }
  } catch (_e) {
    // Ignore storage parse error
  }
  return [...INITIAL_DATABASE_ITEMS];
};

// ─── Live Database Background Synchronization ─────────────────────────────────
// Queries live backend APIs and refreshes memory & localStorage.
// Inserts appear immediately; deletes are purged automatically.
export const syncLiveDatabase = async (
  onUpdate?: (items: SearchResult[]) => void
): Promise<SearchResult[]> => {
  try {
    const [
      visaRes,
      permitsRes,
      pkgRes,
      hotelRes,
      vehRes,
      insRes,
      docRes,
    ] = await Promise.allSettled([
      getVisaCategories(),
      getGroupedWorkPermitCountries(),
      getPackages(),
      getHotels(),
      getAllVehicles(),
      getInsurancePlans(),
      getAllDocuments(),
    ]);

    // 1. Live Visas from Database
    const liveVisas: SearchResult[] = [];
    if (visaRes.status === "fulfilled") {
      const raw = visaRes.value?.data;
      const list: any[] = Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw?.data?.data)
        ? raw.data.data
        : Array.isArray(raw)
        ? raw
        : [];

      list
        .filter((v) => v?.status === "ACTIVE" || !v?.status)
        .forEach((v) => {
          const countryName = v.country?.country_name || "";
          const label =
            countryName && !v.name?.toLowerCase().includes(countryName.toLowerCase())
              ? `${countryName} – ${v.name}`
              : v.name || "Visa Service";

          liveVisas.push({
            id: `visa-${v.id}`,
            label,
            sublabel: v.short_description || countryName || "Visa Services",
            type: "visa",
            route: `/visa-details/${v.id}`,
            icon: Shield,
          });
        });
    }

    // 2. Live Work Permit & Shram Countries from Database
    // Strictly 1-to-1 with live DB permit records.
    // Each record in /permit-document-requirements/grouped corresponds to exactly 1 permit service.
    const livePermits: SearchResult[] = [];
    if (permitsRes.status === "fulfilled") {
      const raw = permitsRes.value?.data;
      const list: any[] = Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw?.data?.data)
        ? raw.data.data
        : Array.isArray(raw)
        ? raw
        : [];

      const PERMIT_TYPE_LABELS: Record<string, string> = {
        RENEWAL_PERMIT: "Renewal Permit",
        NEW_LABOUR_PERMIT: "New Labour Permit",
        INDIVIDUAL_PERMIT: "Individual Permit",
        LEGALIZATION_ATTESTATION: "Legalization / Attestation",
      };

      list.forEach((item: any) => {
        const c = item?.country;
        const pt = item?.permit_type;
        if (!c || !pt) return;
        if (c.status && c.status !== "ACTIVE") return;

        const ptLabel = PERMIT_TYPE_LABELS[pt] || pt.replace(/_/g, " ");
        const code = (c.country_code || c.iso_2 || "").toUpperCase();
        const aliases =
          code === "UAE"
            ? "UAE (Dubai / Abu Dhabi)"
            : code
            ? `(${code})`
            : "";

        livePermits.push({
          id: `permit-${c.id}-${pt}`,
          label: `${c.country_name} – ${ptLabel}`,
          sublabel: `Labour Approval & Shram Documentation for ${c.country_name} ${aliases}`.trim(),
          type: "service",
          route: `/permit-details/${c.id}?permitType=${pt}`,
          icon: FileText,
        });
      });
    }

    // 3. Live Packages from Database (Only if present in DB)
    const livePackages: SearchResult[] = [];
    if (pkgRes.status === "fulfilled") {
      const raw = pkgRes.value?.data;
      const list: any[] = Array.isArray(raw?.data?.data)
        ? raw.data.data
        : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw)
        ? raw
        : [];

      list
        .filter((p) => p?.status === "ACTIVE" || !p?.status)
        .forEach((p) => {
          const typeRaw = (
            p.category?.name || p.category?.title || p.type || ""
          ).toLowerCase();

          let resultType: SearchResult["type"] = "tour";
          let icon: React.ElementType = Map;

          if (typeRaw.includes("trek") || typeRaw.includes("hik")) {
            resultType = "trekking";
            icon = Mountain;
          } else if (typeRaw.includes("activity") || typeRaw.includes("adventure")) {
            resultType = "activity";
            icon = Activity;
          } else if (typeRaw.includes("heli")) {
            resultType = "heli";
            icon = Wind;
          }

          livePackages.push({
            id: `pkg-${p.id}`,
            label: p.title || p.name || "Package",
            sublabel: [(p.location || ""), (p.duration || "")].filter(Boolean).join(" • "),
            type: resultType,
            route: `/details/${p.id}`,
            icon,
          });
        });
    }

    // 4. Live Hotels from Database (Only if present in DB)
    const liveHotels: SearchResult[] = [];
    if (hotelRes.status === "fulfilled") {
      const raw = hotelRes.value?.data;
      const list: any[] = Array.isArray(raw?.data?.data)
        ? raw.data.data
        : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw)
        ? raw
        : [];

      list
        .filter((h) => h?.status === "ACTIVE" || !h?.status)
        .forEach((h) => {
          liveHotels.push({
            id: `hotel-${h.id}`,
            label: h.name || "Hotel",
            sublabel: [(h.city || ""), (h.location || "")].filter(Boolean).join(" • "),
            type: "hotel",
            route: `/hotel-details/${h.id}`,
            icon: Bed,
          });
        });
    }

    // 5. Live Vehicles from Database (Only if present in DB)
    const liveVehicles: SearchResult[] = [];
    if (vehRes.status === "fulfilled") {
      const raw = vehRes.value?.data;
      const list: any[] = Array.isArray(raw?.data?.data)
        ? raw.data.data
        : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw)
        ? raw
        : [];

      list
        .filter((v) => v?.status === "ACTIVE" || !v?.status)
        .forEach((v) => {
          liveVehicles.push({
            id: `veh-${v.id}`,
            label: v.name || "Vehicle",
            sublabel: [(v.categoryLabel || v.category || ""), (v.seats || "")].filter(Boolean).join(" • "),
            type: "vehicle",
            route: `/vehicle-details/${v.id}`,
            icon: Car,
          });
        });
    }

    // 6. Live Insurance Plans from Database (Only if present in DB)
    const liveInsurance: SearchResult[] = [];
    if (insRes.status === "fulfilled") {
      const raw = insRes.value?.data;
      const list: any[] = Array.isArray(raw?.data?.data)
        ? raw.data.data
        : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw)
        ? raw
        : [];

      list
        .filter((p) => p?.status === "ACTIVE" || !p?.status)
        .forEach((p) => {
          liveInsurance.push({
            id: `ins-${p.id}`,
            label: p.name || p.title || "Insurance Plan",
            sublabel: p.description || "Travel Insurance",
            type: "insurance",
            route: `/insurance-details/${p.id}`,
            icon: Heart,
          });
        });
    }

    // 7. Live Documents from Database (Only if present in DB)
    const liveDocs: SearchResult[] = [];
    if (docRes.status === "fulfilled") {
      const raw = docRes.value?.data;
      const list: any[] = Array.isArray(raw?.data?.data)
        ? raw.data.data
        : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw)
        ? raw
        : [];

      list
        .filter((d) => d?.status === "ACTIVE" || !d?.status)
        .forEach((d) => {
          liveDocs.push({
            id: `doc-${d.id}`,
            label: d.title || d.name || "Document",
            sublabel: d.description || "Documentation Service",
            type: "service",
            route: `/documentation/${d.id}`,
            icon: FileText,
          });
        });
    }

    // Combine verified live items
    const finalVisas =
      liveVisas.length > 0
        ? liveVisas
        : INITIAL_DATABASE_ITEMS.filter((i) => i.type === "visa");
    const finalPermits =
      livePermits.length > 0
        ? livePermits
        : INITIAL_DATABASE_ITEMS.filter((i) => String(i.id).startsWith("permit-"));

    const updatedLiveIndex: SearchResult[] = [
      ...finalVisas,
      ...finalPermits,
      ...livePackages,
      ...liveHotels,
      ...liveVehicles,
      ...liveInsurance,
      ...liveDocs,
    ];

    if (onUpdate) {
      onUpdate(updatedLiveIndex);
    }

    // Cache to localStorage
    try {
      const serializable = updatedLiveIndex.map(({ icon: _icon, ...rest }) => rest);
      localStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(serializable));
      localStorage.setItem(SEARCH_STORAGE_TIMESTAMP_KEY, String(Date.now()));
    } catch (_storageErr) {
      // Ignore quota errors
    }

    return updatedLiveIndex;
  } catch (_err) {
    return getCachedSearchItems();
  }
};

// ─── High-Speed Search Algorithm (In-Memory, 0ms execution) ───────────────────
export const executeSearch = (
  query: string,
  allItems: SearchResult[],
  limit = 20
): SearchResult[] => {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const words = trimmed.split(/[\s,]+/).filter(Boolean);

  return allItems
    .map((item) => {
      const lbl = item.label.toLowerCase();
      const sub = (item.sublabel ?? "").toLowerCase();
      const typ = item.type.toLowerCase();
      const lblWords = lbl.split(/[\s\-–—/()]+/).filter(Boolean);
      const subWords = sub.split(/[\s\-–—/(),.]+/).filter(Boolean);

      let score = 0;
      words.forEach((word) => {
        // 1. Exact label match (e.g. 'thailand')
        if (lbl === word) {
          score += 100;
        }
        // 2. Label starts with search query (e.g. 'th' -> 'Thailand – Tourist Visa')
        else if (lbl.startsWith(word)) {
          score += 70;
        }
        // 3. Any individual word in the label starts with search query
        else if (lblWords.some((w) => w.startsWith(word))) {
          score += 50;
        }
        // 4. Label contains the word (only for longer queries >= 3 chars, to prevent 2-letter noise)
        else if (word.length >= 3 && lbl.includes(word)) {
          score += 25;
        }

        // 5. Any individual word in the sublabel starts with search query
        if (subWords.some((w) => w.startsWith(word))) {
          score += 15;
        } else if (word.length >= 4 && sub.includes(word)) {
          score += 5;
        }

        // 6. Type matches or starts with search query
        if (typ === word) {
          score += 30;
        } else if (typ.startsWith(word)) {
          score += 20;
        }
      });

      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
};

