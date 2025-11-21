import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Build a full logo URL from a possibly relative path
export function buildLogoUrl(raw, API_URL) {
  if (!raw) return null;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  // Ensure leading slash once
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return `${API_URL}${path}`;
}

// Resolve company data given a job object and optional companiesMap (id -> company object)
export function resolveCompany(job, companiesMap = {}) {
  if (!job) return { company: null, name: null, logo: null };
  let companyObj = null;

  // Possible shapes
  if (job.company && typeof job.company === 'object') companyObj = job.company;
  // companyId may be an object or an id string
  if (!companyObj && job.companyId && typeof job.companyId === 'object') companyObj = job.companyId;
  if (!companyObj && job.companyId && typeof job.companyId === 'string') companyObj = companiesMap[job.companyId];

  const name = companyObj?.name || job.companyName || null;
  const logoRaw = companyObj?.logo || companyObj?.logoUrl || null;

  return { company: companyObj, name, logo: logoRaw };
}

export const COMPANY_PLACEHOLDER = "https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons/building.svg";
