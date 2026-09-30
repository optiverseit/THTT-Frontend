/**
 * Insurance Document Configuration
 * Acts as the central config / API data source for document requirements.
 * Replace DEFAULT_DOCUMENT_CONFIG with an API fetch when your backend is ready.
 */

export interface InsuranceDocumentField {
  /** Unique key used as the file slot identifier (no spaces) */
  id: string;
  /** Document title shown in the modal row */
  title: string;
  /** Subtitle / hint shown below the title */
  subtitle: string;
  /** If true the user must upload before submitting */
  required: boolean;
  /** Accepted MIME / extension string for the file input */
  accept: string;
}

/** ---------------------------------------------------------------------
 *  DEFAULT CONFIG  (replace with API response in production)
 *  --------------------------------------------------------------------- */
export const DEFAULT_DOCUMENT_CONFIG: InsuranceDocumentField[] = [
  {
    id: "passportFile",
    title: "Passport / NID / Citizenship Scanned Copy",
    subtitle: "Clear color scan of Passport, National ID (NID), or Citizenship certificate",
    required: true,
    accept: ".jpg,.jpeg,.png,.pdf",
  },
  {
    id: "photoFile",
    title: "Passport Size Photo (MRP)",
    subtitle: "Recent front-facing digital photo with white background",
    required: true,
    accept: ".jpg,.jpeg,.png",
  },
  {
    id: "itineraryFile",
    title: "Trekking Permit / Route Itinerary",
    subtitle: "TIMS card, conservation permit, or route itinerary slip (optional)",
    required: false,
    accept: ".jpg,.jpeg,.png,.pdf",
  },
];

/** Helper – build an empty file-map object from the config */
export const buildEmptyDocumentFiles = (
  config: InsuranceDocumentField[]
): Record<string, File | null> =>
  config.reduce(
    (acc, field) => ({ ...acc, [field.id]: null }),
    {} as Record<string, File | null>
  );
