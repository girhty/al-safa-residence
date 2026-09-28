export type Lang = 'ar' | 'en';
export const LANGS: Lang[] = ['ar', 'en'];

/** Arabic lives at the root, English under /en/ */
export function localizePath(path: string, lang: Lang): string {
  let p = path.startsWith('/') ? path : `/${path}`;
  if (!p.endsWith('/')) p += '/';
  if (lang === 'ar') return p;
  return p === '/' ? '/en/' : `/en${p}`;
}

/** Latin digits in both locales for consistency with phone numbers & official posts */
export function formatNumber(n: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-IQ-u-nu-latn' : 'en-US').format(n);
}

export const ui = {
  ar: {
    siteName: 'مجمع الصفا السكني',
    tagline: 'حياة تستحقها',
    ogAlt: 'مجمع الصفا السكني في البيبان، البصرة',
    nav: { home: 'الرئيسية', properties: 'الوحدات السكنية', gallery: 'معرض الصور', about: 'عن المشروع', contact: 'تواصل معنا' },
    navLabel: 'القائمة الرئيسية',
    cta: 'اطلب معاينة',
    langSwitch: 'English',
    langSwitchLabel: 'عرض هذه الصفحة باللغة الإنجليزية',
    skip: 'تخطَّ إلى المحتوى الرئيسي',
    menuOpen: 'فتح القائمة',
    menuClose: 'إغلاق القائمة',
    homeLink: 'مجمع الصفا السكني — الصفحة الرئيسية',
    offline: 'أنت غير متصل بالإنترنت حالياً. يُعرض المحتوى المحفوظ، وقد تكون بعض الأقسام غير متاحة.',
    comingSoon: 'قريباً',
    onRequest: 'عند الطلب',
    unconfigured: 'غير مكتمل',
    imgUnavailable: 'تعذّر تحميل الصورة',
    footer: {
      heading: 'معلومات الموقع',
      about: 'مجمع أبراج سكنية حديثة في منطقة البيبان بقضاء شط العرب في البصرة — حيث رفاهية السكن لمستقبل أفضل.',
      quick: 'روابط سريعة',
      contact: 'مراكز المبيعات',
      hours: 'ساعات العمل',
      follow: 'تابعنا',
      email: 'البريد الإلكتروني',
      rights: 'جميع الحقوق محفوظة.',
      a11y: 'بيان إمكانية الوصول وتحسين البحث',
      sourceNote: 'أرقام الهواتف وساعات العمل مأخوذة من الحساب الرسمي على إنستغرام وخرائط Google، وتنتظر تأكيد الإدارة.',
    },
    tray: {
      label: 'أداة مقارنة الوحدات',
      one: 'وحدة واحدة محددة للمقارنة',
      two: 'وحدتان محددتان للمقارنة',
      many: '{n} وحدات محددة للمقارنة',
      go: 'قارن الآن',
      clear: 'مسح الاختيار',
      max: 'يمكنك مقارنة 3 وحدات كحد أقصى. أزل وحدة لإضافة أخرى.',
    },
  },
  en: {
    siteName: 'Al Safa Residence',
    tagline: 'A life you deserve',
    ogAlt: 'Al Safa Residence in Al-Beban, Basra',
    nav: { home: 'Home', properties: 'Units', gallery: 'Gallery', about: 'About', contact: 'Contact' },
    navLabel: 'Main navigation',
    cta: 'Request a viewing',
    langSwitch: 'العربية',
    langSwitchLabel: 'View this page in Arabic',
    skip: 'Skip to main content',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    homeLink: 'Al Safa Residence — home page',
    offline: 'You are offline. Saved content is shown and some sections may be unavailable.',
    comingSoon: 'Coming soon',
    onRequest: 'On request',
    unconfigured: 'Unconfigured',
    imgUnavailable: 'Image could not be loaded',
    footer: {
      heading: 'Site information',
      about: 'Modern residential towers in Al-Beban, Shatt Al-Arab District, Basra — where comfortable living shapes a better future.',
      quick: 'Quick links',
      contact: 'Sales centres',
      hours: 'Opening hours',
      follow: 'Follow us',
      email: 'Email',
      rights: 'All rights reserved.',
      a11y: 'Accessibility & SEO statement',
      sourceNote: 'Phone numbers and hours come from the official Instagram account and Google Maps and await management confirmation.',
    },
    tray: {
      label: 'Unit comparison tool',
      one: '1 unit selected to compare',
      two: '2 units selected to compare',
      many: '{n} units selected to compare',
      go: 'Compare now',
      clear: 'Clear selection',
      max: 'You can compare up to 3 units. Remove one to add another.',
    },
  },
} as const;