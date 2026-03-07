import countries from "world-countries/countries.json";

const EXCLUDED_CCA2 = new Set(["RU", "BY"]); // Russia, Belarus

// A small compatibility map for legacy values already stored in DB / querystrings.
const LEGACY_COUNTRY_MAP = {
  usa: "United States",
  us: "United States",
  "united-states": "United States",
  "united-states-of-america": "United States",
  uk: "United Kingdom",
  "united-kingdom": "United Kingdom",
  uae: "United Arab Emirates",
  "united-arab-emirates": "United Arab Emirates",
  pakistan: "Pakistan",
  india: "India",
};

const COUNTRY_NAME_SET = new Set(
  countries
    .filter((c) => c?.cca2 && !EXCLUDED_CCA2.has(c.cca2))
    .map((c) => c?.name?.common)
    .filter(Boolean)
);

function toTitleFromSlug(input) {
  return (input || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function normalizeCountryValue(raw) {
  const v = (raw || "").toString().trim();
  if (!v) return "";

  // If it's already an allowed country name, keep it.
  if (COUNTRY_NAME_SET.has(v)) return v;

  const lowered = v.toLowerCase();
  const legacy = LEGACY_COUNTRY_MAP[lowered];
  if (legacy && COUNTRY_NAME_SET.has(legacy)) return legacy;

  // Try common slug-like formats.
  const titled = toTitleFromSlug(v);
  if (COUNTRY_NAME_SET.has(titled)) return titled;

  // Last resort: keep original (so UI doesn't wipe unknown values).
  return v;
}

export const countryOptions = countries
  .filter((c) => c?.cca2 && !EXCLUDED_CCA2.has(c.cca2))
  .map((c) => {
    const name = c?.name?.common;
    return { value: name, label: name };
  })
  .filter((o) => !!o.value)
  .sort((a, b) =>
    a.label.localeCompare(b.label, "en", { sensitivity: "base" })
  );

