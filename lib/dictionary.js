export const dictionary = {
  bn: {
    siteName: 'কর্পোরেট ফাইল',
    tagline: 'বিশ্বের বড় কোম্পানিগুলোর গল্প ও পেছনের ইতিহাস',
    nav: { home: 'হোম', blog: 'সব গল্প', about: 'আমাদের সম্পর্কে' },
    readMore: 'পুরো গল্প পড়ুন',
    fileNo: 'ফাইল নং',
    founded: 'প্রতিষ্ঠা',
    headquarters: 'সদর দপ্তর',
    sector: 'খাত',
    relatedFiles: 'সংশ্লিষ্ট ফাইল',
    switchLang: 'English',
    searchPlaceholder: 'কোম্পানির নাম খুঁজুন...',
    footerNote: 'প্রতিটি লেখা যাচাই করে প্রকাশ করা হয়',
  },
  en: {
    siteName: 'The Corporate File',
    tagline: 'Origin stories and inside history of the world\u2019s biggest companies',
    nav: { home: 'Home', blog: 'All Stories', about: 'About' },
    readMore: 'Read the full story',
    fileNo: 'File No.',
    founded: 'Founded',
    headquarters: 'Headquarters',
    sector: 'Sector',
    relatedFiles: 'Related Files',
    switchLang: 'বাংলা',
    searchPlaceholder: 'Search a company...',
    footerNote: 'Every story is fact-checked before publishing',
  },
};

export function getDictionary(locale) {
  return dictionary[locale] || dictionary.en;
}
