export const dictionary = {
  bn: {
    siteName: 'Bizkotha',
    tagline: 'বাংলাদেশের ব্যবসা, সংবাদ ও গল্পের প্ল্যাটফর্ম',
    nav: { home: 'হোম', blog: 'সব গল্প', about: 'আমাদের সম্পর্কে' },
    readMore: 'পুরো গল্প পড়ুন',
    fileNo: 'ফাইল নং',
    founded: 'প্রতিষ্ঠা',
    headquarters: 'সদর দপ্তর',
    sector: 'খাত',
    relatedFiles: 'সংশ্লিষ্ট ফাইল',
    switchLang: 'English',
    searchPlaceholder: 'Search',
    footerNote: 'প্রতিটি লেখা যাচাই করে প্রকাশ করা হয়',
  },
  en: {
    siteName: 'Bizkotha',
    tagline: 'Business, news and stories from Bangladesh',
    nav: { home: 'Home', blog: 'All Stories', about: 'About' },
    readMore: 'Read the full story',
    fileNo: 'File No.',
    founded: 'Founded',
    headquarters: 'Headquarters',
    sector: 'Sector',
    relatedFiles: 'Related Files',
    switchLang: 'বাংলা',
    searchPlaceholder: 'Search',
    footerNote: 'Every story is fact-checked before publishing',
  },
};

export function getDictionary(locale) {
  return dictionary[locale] || dictionary.en;
}
