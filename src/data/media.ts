export type MediaCategory = 'residence' | 'campaigns' | 'interiors' | 'amenities';

export interface Media {
  id: string;
  src: string;
  srcset?: string;
  large?: string;
  width: number;
  height: number;
  source: 'google' | 'instagram';
  category: MediaCategory;
  alt: { ar: string; en: string };
  caption?: string;
}

const G1 =
  'https://lh3.googleusercontent.com/grass-cs/ACvplmOHx2FLIzfIvLyC5sMFK4xTfOwWZ6LkvXWiXInsJ9uy_TjABFJ3o5kX9wKj3ZggFKozQ3usKwIL425yDYtJ7CT4yLwc3gf6r56Jojy9dYzxh-7lLGtOA2D4afKrhskhbCD47GEmr7Oa7eR_';
const G3 =
  'https://lh3.googleusercontent.com/grass-cs/ACvplmOXmItcF-DBFOBAv9MCvqftmcLQDTb5AwABD5u255XoXTFd-Fqatpe8MV5QES_Clh-wK1KTTgdf-L7HcAKaH8_ccAHcu2NE8Q2GnZquBCKGGoHILq6GTx_YiqAm17SVikwsNJw';
const g = (base: string, w: number, h: number) => `${base}=w${w}-h${h}-k-no`;

const ig = (id: string, src: string, ar: string, en: string, caption: string): Media => ({
  id,
  src,
  width: 640,
  height: 640,
  source: 'instagram',
  category: 'campaigns',
  caption,
  alt: {
    ar: `منشور ترويجي من حساب مجمع الصفا السكني على إنستغرام: ${ar}`,
    en: `Promotional post from Al Safa Residence on Instagram: ${en}`,
  },
});

const TAGS = '#مجمع_الصفا_السكني #حياة_تستحقها #حداثة #MEC';
const SALES = 'يسرّنا استقبالكم في مركز المبيعات\nالبصرة – قضاء شط العرب / منطقة البيبان\n0784 400 0063\n0774 400 0063';

export const media: Media[] = [
  {
    id: 'g1',
    src: g(G1, 1280, 960),
    srcset: [`${g(G1, 408, 305)} 408w`, `${g(G1, 800, 600)} 800w`, `${g(G1, 1280, 960)} 1280w`, `${g(G1, 1920, 1440)} 1920w`].join(', '),
    large: g(G1, 1920, 1440),
    width: 1280,
    height: 960,
    source: 'google',
    category: 'residence',
    alt: {
      ar: 'صورة لمجمع الصفا السكني في منطقة البيبان بالبصرة، منشورة على خرائط Google',
      en: 'Photo of Al Safa Residence in Al-Beban, Basra, published on Google Maps',
    },
  },
  {
    id: 'g3',
    src: g(G3, 720, 900),
    srcset: [`${g(G3, 360, 450)} 360w`, `${g(G3, 720, 900)} 720w`, `${g(G3, 1080, 1350)} 1080w`].join(', '),
    large: g(G3, 1080, 1350),
    width: 720,
    height: 900,
    source: 'google',
    category: 'residence',
    alt: {
      ar: 'صورة ثانية لمجمع الصفا السكني منشورة على خرائط Google',
      en: 'Second photo of Al Safa Residence published on Google Maps',
    },
  },
  ig(
    'ig1',
    'https://scontent-ams2-1.cdninstagram.com/v/t51.82787-15/621352272_17942068886982026_3814215525832390341_n.webp?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=101&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=BYktzPZnXrIQ7kNvwEIwKts&_nc_oc=AdpOsZCPTe4okkHF9Qpk68W3sYz09ZghYot1lLQA7slshWiDxE_i1B3C89jy-3a6rYw&_nc_zt=23&_nc_ht=scontent-ams2-1.cdninstagram.com&_nc_gid=A5umxyIl6LHyraKYagI9gg&_nc_ss=7ca8c&oh=00_AQOuknBBeLE7rWrvXGc6LaRCn83BKGo-9QGACmpOa_UueQ&oe=6AC0BC67',
    'حياة تستحقها، مليئة بالراحة والرفاهية',
    'a life you deserve, full of comfort and luxury',
    `حياة تستحقها، مليئة بالراحة والرفاهية\n${TAGS}`,
  ),
  ig(
    'ig2',
    'https://scontent-ams2-1.cdninstagram.com/v/t51.71878-15/491427989_1237346811069885_8172521650871428122_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=106&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=GC3t3lzBVCkQ7kNvwEruxaa&_nc_oc=AdrQc0I0QAU_RjGvsjSyr14IKR3j25X1wgEe1X_ruP7W4zGLZOWPd5jIavzzrbNlYmM&_nc_zt=23&_nc_ht=scontent-ams2-1.cdninstagram.com&_nc_gid=A5umxyIl6LHyraKYagI9gg&_nc_ss=7ca8c&oh=00_AQMkAqD6u8pUTlAvZyLlCMAkJExRxdjj_aprmlOmXgR6IQ&oe=6AC0A942',
    'خيارات القروض المصرفية لتملّك شقتك',
    'bank loan options to own your apartment',
    'الحياة التي تستحقها عائلتك أصبحت أقرب مع مجمع الصفا السكني\n\nاستفد من القروض المتاحة لتملك شقتك الآن:\n\nقرض مصرف الرافدين\nفترة سداد تصل إلى 20 عامًا\nدفع مقدم 25% فقط من المبلغ الإجمالي.\n\nقرض مصرف التجارة العراقي TBI\nبدون مقدم\nدفعات شهرية ميسرة تبدأ من 739,000 دينار فقط.\n\nزورونا في مركز مبيعات مجمع الصفا السكني\n\nالفرع الأول:\nالبصرة - قضاء شط العرب / منطقة البيبان\n0784 400 0063 | 0774 400 0063\n\nالفرع الثاني:\nالبصرة - شارع السعدي / بناية مركز البولينغ\n0771 633 3376 | 0781 633 3376\n\n' + TAGS,
  ),
  ig(
    'ig3',
    'https://scontent-ams2-1.cdninstagram.com/v/t51.71878-15/502161902_565776566571542_1919637393323374554_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=104&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=0HFmyhhP-EsQ7kNvwE88o4W&_nc_oc=AdrXpDMWhj6mtKdDRBWMi0t4wjJMpctQCynko8n9qCPHepcBL1KU01-16mXwiesbl2A&_nc_zt=23&_nc_ht=scontent-ams2-1.cdninstagram.com&_nc_gid=A5umxyIl6LHyraKYagI9gg&_nc_ss=7ca8c&oh=00_AQM-ZvkzjJSYsalNpKxLFJG2IALwHcuaklXyXWBv2gKEsA&oe=6AC0B364',
    'حياة تستحقها أنت وعائلتك',
    'a life you and your family deserve',
    `حياة تستحقها انت وعائلتك\n\n${TAGS}`,
  ),
  ig(
    'ig4',
    'https://scontent-ams2-1.cdninstagram.com/v/t51.82787-15/825276457_18017860268948868_8486797290511228187_n.webp?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=111&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=J14pV9IAwk0Q7kNvwESjSM-&_nc_oc=Adoqz9_o-LulzKZNOXb-5nu0m8iSNeqlxeZhev-zHTTV8vJpqgcg72BzYEbxn1ZCoRg&_nc_zt=23&_nc_ht=scontent-ams2-1.cdninstagram.com&_nc_gid=A5umxyIl6LHyraKYagI9gg&_nc_ss=7ca8c&oh=00_AQPTTL6x4Ce375ktM18L2CKXBjfMz9CYEwBPW84_mQ96EQ&oe=6AC0A991',
    'آخر أيام الخصومات الحصرية في معرض النفط والغاز',
    'last day of exclusive discounts at the Oil & Gas Exhibition',
    `الفرصة الاخيرة حتى تحصل خصومات حصرية على شقق ابراج مدينة\nفي اليوم الأخير من معرض النفط والغاز ننتظر زيارتكم في جناح مدينة الصفا.\nمجمع الصفا السكني\nحياة تستحقها\n${SALES}\n\n${TAGS}`,
  ),
  ig(
    'ig5',
    'https://scontent-ams2-1.cdninstagram.com/v/t39.30808-6/824181255_1081062424911335_150612865430230284_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=101&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0FST1VTRUxfSVRFTS5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=OMaC1Gxt4HEQ7kNvwH30Zo0&_nc_oc=AdqgTh3-hCaSHHTV1O2SBLhHjjcN4RQciY__fWjVbaKN2S3eVH6-BVj3DodTffVCZ24&_nc_zt=23&_nc_ht=scontent-ams2-1.cdninstagram.com&_nc_gid=A5umxyIl6LHyraKYagI9gg&_nc_ss=7ca8c&oh=00_AQNGIsV-mO7zpJKyzLrWdgcuBr7uajliEKMm7seswJuoqA&oe=6AC0C228',
    'مشاركة المجمع في معرض البصرة الدولي للنفط والغاز',
    'Al Safa Residence at the Basra International Oil & Gas Exhibition',
    `مجمع الصفا السكني حاضر في معرض البصرة الدولي للنفط والغاز.\n\nزورونا في جناحنا وتعرّفوا أكثر على المشروع، واستفيدوا من العروض والتخفيضات الحصرية المتوفرة لغاية 27 أيلول.\n\nمجمع الصفا السكني\nحياة تستحقها\n\n${SALES}\n\n${TAGS}`,
  ),
  ig(
    'ig6',
    'https://scontent-ams2-1.cdninstagram.com/v/t51.82787-15/820542932_18017543447948868_4887291769835384517_n.webp?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=100&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=Im4zWoziiXwQ7kNvwE0-TzS&_nc_oc=AdpUh4qD5X4eZ7az8F7wMH5MhQThthbd5B_qxIcHR4RRs3G7jKlVOJmDbLlUNVGFzHI&_nc_zt=23&_nc_ht=scontent-ams2-1.cdninstagram.com&_nc_gid=A5umxyIl6LHyraKYagI9gg&_nc_ss=7ca8c&oh=00_AQMemhlpEwMdpa8ZNj1BjnvuxW42HLVRBUzj6N6YReobRg&oe=6AC0BE8F',
    'دعوة لزيارة جناح مدينة الصفا في معرض البصرة الدولي',
    'an invitation to visit the Al Safa City booth at the Basra International Exhibition',
    `فرصتك لتبدأ خطوتك نحو الحياة التي تستحقها، بانتظارك في معرض النفط والغاز.\nزورونا في مركز المبيعات او بوث مدينة الصفا في معرض البصرة الدولي من 24 إلى 27 أيلول واستفيدوا من العروض المميزة والحصرية لزوار المعرض.\n\nمجمع الصفا السكني\nحياة تستحقها\n\n${SALES}\n\n${TAGS}`,
  ),
  ig(
    'ig7',
    'https://scontent-ams2-1.cdninstagram.com/v/t51.82787-15/822807385_18392740273200930_6471488242820444242_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=103&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=I3Fh7e_NEdsQ7kNvwE7Jwnv&_nc_oc=AdqwLiLgmZwePpZ7UNF0AsCWHEjBWC71eUVv8ErclyXxPEZ3-gW1XgdeW_ZddcRQsmY&_nc_zt=23&_nc_ht=scontent-ams2-1.cdninstagram.com&_nc_gid=A5umxyIl6LHyraKYagI9gg&_nc_ss=7ca8c&oh=00_AQNj8XRW4BcW68QCcyYdB1sGYLlVyaEoDvjLCKYgsQsCIw&oe=6AC0A98E',
    'أرقام الحجز والاستفسار',
    'phone numbers for bookings and enquiries',
    'للحجز والاستفسار\n07844000063\n07744000063\n@alsafaresidence',
  ),
  ig(
    'ig8',
    'https://scontent-ams2-1.cdninstagram.com/v/t39.30808-6/797798956_1059983240423502_346316259385606842_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=103&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=7R5dt9Jqa0IQ7kNvwGp2X7B&_nc_oc=AdoPjML9a0GI5iwmchJxTZU3pO1Fff2uQv7ABxxhie5_4GpPHMFDlsU0RdoEskA1FyE&_nc_zt=23&_nc_ht=scontent-ams2-1.cdninstagram.com&_nc_gid=A5umxyIl6LHyraKYagI9gg&_nc_ss=7ca8c&oh=00_AQNuNgR6gGd--yiK2RdilA1eM8UJ7LSNqETVAoUQu4sN4Q&oe=6AC0B8A3',
    'عروض وخصومات على شقق مدينة الصفا السكنية',
    'special offers on Al Safa City apartments',
    'عروض وخصومات استثنائية على شقق مدينة الصفا السكنية ضمن فعاليات معرض النفط والغاز',
  ),
  ig(
    'ig9',
    'https://scontent-ams2-1.cdninstagram.com/v/t51.71878-15/820335914_953765840500743_3009762558438125495_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=101&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=TUC4ABSt53EQ7kNvwFnnaym&_nc_oc=Adp1D_PC6i49BEHvNAIjYdhu7gh8MZJl74sxwJLE51r8Wl4QEwn3xHw9XTZvxuR5SQo&_nc_zt=23&_nc_ht=scontent-ams2-1.cdninstagram.com&_nc_gid=A5umxyIl6LHyraKYagI9gg&_nc_ss=7ca8c&oh=00_AQOyQ7vNYeB0aFTpBkAQfhyD_cIi7nulG-KhhCWTDkh7vg&oe=6AC0CF07',
    'خصم حصري على شقق أبراج مدينة الصفا',
    'exclusive discount on Al Safa City Towers apartments',
    `فرصتك حتى تمتلك شقتك في أبراج مدينة الصفا بخصم استثنائي وحصري،\nمن 24 إلى 27 أيلول، زورنا في جناح الصفا بمعرض البصرة الدولي للنفط والغاز أو في مركز المبيعات داخل المدينة، واستفاد من العرض قبل انتهائه.\n27 أيلول هو آخر يوم للعرض.\nلا تفوت الفرصة.\n\nمجمع الصفا السكني\nحياة تستحقها\n\n${SALES}\n\n${TAGS}`,
  ),
  ig(
    'ig10',
    'https://scontent-ams2-1.cdninstagram.com/v/t51.82787-15/819002802_18010348772971869_5061797295522855_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=111&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=ufqbjYr4EIYQ7kNvwHj7I0r&_nc_oc=AdpTBPhCtia_wwvBgSX3xKi8gBP4S7gwoUeehc1nVQUVJ16kUeV2GO6OdxFO8UI6VC8&_nc_zt=23&_nc_ht=scontent-ams2-1.cdninstagram.com&_nc_gid=A5umxyIl6LHyraKYagI9gg&_nc_ss=7ca8c&oh=00_AQOQVByU7dLLWw2EMFUHKgWICOrCgJa8OohNfPYVL2SDEg&oe=6AC0ADE1',
    'تخفيضات مميزة على الأبراج خلال معرض النفط والغاز',
    'special tower discounts during the Oil & Gas Exhibition',
    'مجمع الصفا السكني يطلق تخفيضات مميزة على أبراجه حصرياً خلال معرض النفط والغاز #المربد',
  ),
];

export const mediaById = (id: string): Media | undefined => media.find((m) => m.id === id);