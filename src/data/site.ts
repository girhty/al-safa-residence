import type { Lang } from '../i18n/ui';

/** Placeholder production domain — غير مكتمل / unconfigured */
export const SITE_URL = 'https://al-safa-residence.example.com';

/**
 * Form endpoint — غير مكتمل / unconfigured.
 * Set PUBLIC_FORM_ENDPOINT in `.env` (e.g. a Formspree / own API URL accepting JSON POST).
 * While empty, forms run in a clearly-labelled preview mode that simulates submission.
 */
export const FORM_ENDPOINT: string = (import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined) ?? '';

const G1_BASE =
  'https://lh3.googleusercontent.com/grass-cs/ACvplmOHx2FLIzfIvLyC5sMFK4xTfOwWZ6LkvXWiXInsJ9uy_TjABFJ3o5kX9wKj3ZggFKozQ3usKwIL425yDYtJ7CT4yLwc3gf6r56Jojy9dYzxh-7lLGtOA2D4afKrhskhbCD47GEmr7Oa7eR_';
export const OG_IMAGE = `${G1_BASE}=w1200-h630-p-k-no`;

type L10n = Record<Lang, string>;
export interface Phone { display: string; tel: string }
export interface Branch { id: string; name: L10n; address: L10n; phones: Phone[] }

export const business = {
  name: { ar: 'مجمع الصفا السكني', en: 'Al Safa Residence' } as L10n,
  tagline: { ar: 'حياة تستحقها', en: 'A life you deserve' } as L10n,
  vision: { ar: 'حيث رفاهية السكن لمستقبل أفضل', en: 'Where comfortable living shapes a better future' } as L10n,
  rating: 4.8,
  reviewCount: 5,
  plusCode: 'HR9X+3X',
  address: {
    ar: 'البصرة – قضاء شط العرب / منطقة البيبان',
    en: 'Al-Beban, Shatt Al-Arab District, Basra, Iraq',
  } as L10n,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Al Safa Residence HR9X+3X Basrah Iraq')}`,
  mapEmbed: `https://www.google.com/maps?q=${encodeURIComponent('HR9X+3X Basrah, Iraq')}&output=embed`,
  hours: {
    ar: 'من 9:00 صباحاً إلى 9:30 مساءً — الفرع الرئيسي',
    en: '9:00 AM – 9:30 PM — main branch',
  } as L10n,
  hoursNote: {
    ar: 'أيام العمل الأسبوعية وساعات الفرع الثاني بانتظار التأكيد.',
    en: 'Working days and second-branch hours await confirmation.',
  } as L10n,
  /** غير مكتمل / unconfigured — no public email was supplied */
  email: '',
  branches: [
    {
      id: 'main',
      name: { ar: 'الفرع الرئيسي — مركز المبيعات', en: 'Main branch — Sales centre' },
      address: { ar: 'البصرة – قضاء شط العرب / منطقة البيبان', en: 'Al-Beban, Shatt Al-Arab District, Basra' },
      phones: [
        { display: '0784 400 0063', tel: '+9647844000063' },
        { display: '0774 400 0063', tel: '+9647744000063' },
      ],
    },
    {
      id: 'second',
      name: { ar: 'الفرع الثاني', en: 'Second branch' },
      address: { ar: 'البصرة – شارع السعدي / بناية مركز البولينغ', en: 'Al-Saadi Street, Bowling Centre building, Basra' },
      phones: [
        { display: '0771 633 3376', tel: '+9647716333376' },
        { display: '0781 633 3376', tel: '+9647816333376' },
      ],
    },
  ] as Branch[],
  instagram: {
    handle: 'alsafaresidence',
    url: 'https://www.instagram.com/alsafaresidence/',
    followers: 45916,
    profilePic:
      'https://scontent-ams2-1.cdninstagram.com/v/t51.2885-19/345485424_621514063361832_5109719403266289985_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=105&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=3IgQw1_xDIYQ7kNvwHLQbvB&_nc_oc=Adpww5GxGkPJsWmTprGJ31kBIGH3dxQ-qGX8guPBhsyguYuqAt9AXuOXFY3-pO27WVc&_nc_zt=24&_nc_ht=scontent-ams2-1.cdninstagram.com&_nc_ss=7ca8c&oh=00_AQO66631AbOjt0Vktcus5c8aVo0lgLpJ6TAAJ5X1oIN3Qg&oe=6AC0A6E5',
  },
  /** Verified from the official Instagram post — terms subject to bank confirmation */
  financing: [
    {
      id: 'rafidain',
      bank: { ar: 'قرض مصرف الرافدين', en: 'Rafidain Bank loan' } as L10n,
      points: {
        ar: ['فترة سداد تصل إلى 20 عاماً', 'دفعة مقدّمة 25% فقط من المبلغ الإجمالي'],
        en: ['Repayment period of up to 20 years', 'Down payment of only 25% of the total price'],
      },
    },
    {
      id: 'tbi',
      bank: { ar: 'قرض المصرف العراقي للتجارة (TBI)', en: 'Trade Bank of Iraq (TBI) loan' } as L10n,
      points: {
        ar: ['بدون دفعة مقدّمة', 'أقساط شهرية ميسّرة تبدأ من 739,000 دينار'],
        en: ['No down payment', 'Easy monthly instalments from IQD 739,000'],
      },
    },
  ],
  /** Google reviews — source contained duplicated entries; de-duplicated here, nothing invented */
  reviews: [
    { author: 'Murtadha Aldeer', rating: 5, text: 'Good' },
    { author: 'Ahmed Albadran', rating: 4, text: '' },
    { author: 'Sahar Alyasiri', rating: 5, text: '' },
  ],
};