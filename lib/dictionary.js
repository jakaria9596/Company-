export const dictionary = {
  bn: {
    siteName: 'Bizkotha',
    tagline: 'বাংলাদেশের ব্যবসা, সংবাদ ও গল্পের প্ল্যাটফর্ম',
    homeTitle: 'বিজকোঠা (Bizkotha) | বাংলাদেশের ব্যবসা, সংবাদ ও গল্প',
    homeDescription:
      'বিজকোঠায় পড়ুন বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদ, কর্পোরেট জগতের গল্প এবং ব্যবসা-বাণিজ্যের খবর — যাচাই করা তথ্য, সহজ ভাষায়।',
    nav: { home: 'হোম', blog: 'সব গল্প', about: 'আমাদের সম্পর্কে' },
    readMore: 'পুরো গল্প পড়ুন',
    fileNo: 'ফাইল নং',
    founded: 'প্রতিষ্ঠা',
    headquarters: 'সদর দপ্তর',
    sector: 'খাত',
    relatedFiles: 'সংশ্লিষ্ট লেখা',
    switchLang: 'English',
    searchPlaceholder: 'খুঁজুন',
    empty: 'এখনো কোনো লেখা প্রকাশিত হয়নি।',
    footerNote: 'প্রতিটি লেখা যাচাই করে প্রকাশ করা হয়',
  },
  en: {
    siteName: 'Bizkotha',
    tagline: 'Business, news and stories from Bangladesh',
    homeTitle: 'Bizkotha | Business, news and stories from Bangladesh',
    homeDescription:
      'Read the latest news, corporate stories and business coverage from Bangladesh and the world on Bizkotha — fact-checked and easy to read.',
    nav: { home: 'Home', blog: 'All Stories', about: 'About' },
    readMore: 'Read the full story',
    fileNo: 'File No.',
    founded: 'Founded',
    headquarters: 'Headquarters',
    sector: 'Sector',
    relatedFiles: 'Related Stories',
    switchLang: 'বাংলা',
    searchPlaceholder: 'Search',
    empty: 'No stories yet.',
    footerNote: 'Every story is fact-checked before publishing',
  },
};

export function getDictionary(locale) {
  return dictionary[locale] || dictionary.bn;
}
