import { formatNumber, type Lang } from '../i18n/ui';

export type UnitStatus = 'available' | 'reserved' | 'sold';
export type UnitType = 'apartment';

/**
 * IMPORTANT — no invented data.
 * Only the unit TYPE (apartments in the Al Safa towers) is verified from official posts.
 * All specs are `null` until the developer supplies them; the UI shows «قريباً» / «Coming soon»
 * and prices show «عند الطلب» / «On request». Fill these fields to activate filters & comparison fully.
 */
export interface Unit {
  id: string;
  slug: string;
  code: string;
  type: UnitType;
  name: { ar: string; en: string };
  sizeM2: number | null;
  rooms: number | null;
  bathrooms: number | null;
  floor: number | null;
  tower: string | null;
  status: UnitStatus | null;
  price: number | null;
  imageIds: string[];
  featured?: boolean;
}

const slots: { key: string; ar: string; img: string[]; featured?: boolean }[] = [
  { key: 'a', ar: 'أ', img: ['g1', 'ig1'], featured: true },
  { key: 'b', ar: 'ب', img: ['g3', 'ig3'], featured: true },
  { key: 'c', ar: 'ج', img: ['ig2', 'ig9'], featured: true },
  { key: 'd', ar: 'د', img: ['ig4', 'g1'] },
  { key: 'e', ar: 'هـ', img: ['ig5', 'g3'] },
  { key: 'f', ar: 'و', img: ['ig8', 'ig1'] },
];

export const units: Unit[] = slots.map((s) => ({
  id: `model-${s.key}`,
  slug: `model-${s.key}`,
  code: s.key.toUpperCase(),
  type: 'apartment',
  name: { ar: `شقة — النموذج (${s.ar})`, en: `Apartment — Model ${s.key.toUpperCase()}` },
  sizeM2: null,
  rooms: null,
  bathrooms: null,
  floor: null,
  tower: null,
  status: null,
  price: null,
  imageIds: s.img,
  featured: s.featured ?? false,
}));

export const typeLabels: Record<UnitType, Record<Lang, string>> = {
  apartment: { ar: 'شقة سكنية', en: 'Apartment' },
};

export const statusLabels: Record<UnitStatus | 'unknown', Record<Lang, string>> = {
  available: { ar: 'متاحة', en: 'Available' },
  reserved: { ar: 'محجوزة', en: 'Reserved' },
  sold: { ar: 'مباعة', en: 'Sold' },
  unknown: { ar: 'قريباً', en: 'Coming soon' },
};

export const sizeBuckets = ['lt100', '100-150', 'gt150', 'unknown'] as const;
export type SizeBucket = (typeof sizeBuckets)[number];
export const sizeBucketLabels: Record<SizeBucket, Record<Lang, string>> = {
  lt100: { ar: 'أقل من 100 م²', en: 'Under 100 m²' },
  '100-150': { ar: 'من 100 إلى 150 م²', en: '100–150 m²' },
  gt150: { ar: 'أكثر من 150 م²', en: 'Over 150 m²' },
  unknown: { ar: 'غير محددة بعد (قريباً)', en: 'Not yet specified (coming soon)' },
};

export function sizeBucket(u: Unit): SizeBucket {
  if (u.sizeM2 == null) return 'unknown';
  if (u.sizeM2 < 100) return 'lt100';
  if (u.sizeM2 <= 150) return '100-150';
  return 'gt150';
}

export function unitDisplay(u: Unit, lang: Lang) {
  const soon = lang === 'ar' ? 'قريباً' : 'Coming soon';
  const num = (v: number | null) => (v == null ? soon : formatNumber(v, lang));
  return {
    name: u.name[lang],
    type: typeLabels[u.type][lang],
    size: u.sizeM2 == null ? soon : `${formatNumber(u.sizeM2, lang)} ${lang === 'ar' ? 'م²' : 'm²'}`,
    rooms: num(u.rooms),
    bathrooms: num(u.bathrooms),
    floor: num(u.floor),
    tower: u.tower ?? soon,
    status: statusLabels[u.status ?? 'unknown'][lang],
    statusKey: u.status ?? 'unknown',
    price: u.price == null ? (lang === 'ar' ? 'عند الطلب' : 'On request') : `${formatNumber(u.price, lang)} ${lang === 'ar' ? 'د.ع' : 'IQD'}`,
    sizeBucket: sizeBucket(u),
  };
}