// `active: false` categories are hidden everywhere (menu, tabs, sitemap) until a Notion database is connected.
// To activate one: add its database ID to DB_IDS in lib/notion.js and set active: true here.
// Every category has TWO independent SEO sets: one for the Bengali section (readers in Bangladesh)
// and one for the English section (readers abroad). Each set has its own:
//   h1          - visible page heading
//   title       - <title> (the site name is appended automatically)
//   description - meta description shown in Google results (aim for 120-160 characters)
//   intro       - short visible paragraph at the top of the page (unique text helps Google understand the page)
// Never reuse the same text across categories or languages.
export const CATEGORIES = [
  {
    slug: 'news', bn: 'নিউজ', en: 'News', active: true,
    seo: {
      bn: {
        h1: 'বাংলাদেশ ও বিশ্বের সর্বশেষ নিউজ',
        title: 'সর্বশেষ নিউজ: বাংলাদেশ ও আন্তর্জাতিক সংবাদ',
        description: 'বাংলাদেশ ও আন্তর্জাতিক অঙ্গনের সর্বশেষ সংবাদ, গুরুত্বপূর্ণ ঘটনা ও বিশ্লেষণ পড়ুন বিজকোঠায়। যাচাই করা তথ্য, সহজ ভাষায়।',
        intro: 'দেশ ও বিদেশের গুরুত্বপূর্ণ খবর, দুর্যোগ, খেলা ও আন্তর্জাতিক ঘটনার আপডেট এক জায়গায়। প্রতিটি সংবাদ যাচাই করে সহজ বাংলায় প্রকাশ করা হয়, যাতে অল্প সময়েই পুরো ঘটনাটা বুঝে নিতে পারেন।',
      },
      en: {
        h1: 'Bangladesh and World News',
        title: 'Latest Bangladesh and World News',
        description: 'Follow the latest news from Bangladesh and around the world on Bizkotha: verified reports, key events and clear, easy-to-read analysis.',
        intro: 'Breaking developments, disasters, sport and global events, explained in plain English with a Bangladesh perspective. Every story is fact-checked before publishing.',
      },
    },
  },
  {
    slug: 'corporate', bn: 'কর্পোরেট', en: 'Corporate', active: true,
    seo: {
      bn: {
        h1: 'কোম্পানির গল্প ও কর্পোরেট জগৎ',
        title: 'কর্পোরেট নিউজ ও কোম্পানির প্রতিষ্ঠার গল্প',
        description: 'বিশ্বের বড় কোম্পানির প্রতিষ্ঠার গল্প, ব্যবসায়িক সিদ্ধান্ত, ব্যর্থতা ও সাফল্যের ইতিহাস জানুন। কর্পোরেট জগতের খবর বিজকোঠায়।',
        intro: 'একটা ছোট আইডিয়া থেকে কীভাবে বিলিয়ন ডলারের কোম্পানি হয়, তার গল্প এখানে। প্রতিষ্ঠাতা, সংগ্রাম, ভুল সিদ্ধান্ত ও সাফল্যের পেছনের কারণ সহজ বাংলায় তুলে ধরা হয়।',
      },
      en: {
        h1: 'Corporate Stories and Business History',
        title: 'Company Founding Stories and Corporate News',
        description: 'How the world\u2019s biggest companies began: founders, struggles, key decisions and turning points, told in clear, concise stories on Bizkotha.',
        intro: 'From a small idea to a billion-dollar company: the people, mistakes and decisions behind famous brands, explained simply.',
      },
    },
  },
  {
    slug: 'finance', bn: 'ফাইন্যান্স', en: 'Finance', active: true,
    seo: {
      bn: {
        h1: 'অর্থনীতি, শেয়ারবাজার ও বিনিয়োগ',
        title: 'অর্থনীতি, শেয়ারবাজার ও বিনিয়োগের খবর',
        description: 'বাংলাদেশের অর্থনীতি, শেয়ারবাজার, ব্যাংকিং ও বিনিয়োগের সর্বশেষ খবর এবং সহজ বিশ্লেষণ পড়ুন বিজকোঠার ফাইন্যান্স বিভাগে।',
        intro: 'টাকার বাজার, ব্যাংক, শেয়ার ও বিনিয়োগের খবর কঠিন শব্দ ছাড়া সহজ ভাষায়। এখানের লেখাগুলো শুধু তথ্যের জন্য, এগুলো বিনিয়োগের পরামর্শ নয়।',
      },
      en: {
        h1: 'Economy, Markets and Investing',
        title: 'Bangladesh Economy, Markets and Investing News',
        description: 'Latest news and simple analysis on the Bangladesh economy, stock market, banking and investing, in the Finance section of Bizkotha.',
        intro: 'Money, markets and banking explained without jargon. Articles are for information only and are not investment advice.',
      },
    },
  },
  {
    slug: 'movie-review', bn: 'মুভি রিভিউ', en: 'Movie Review', active: true,
    seo: {
      bn: {
        h1: 'সিনেমা ও সিরিজ রিভিউ',
        title: 'সিনেমা ও ওয়েব সিরিজ রিভিউ',
        description: 'নতুন ও জনপ্রিয় সিনেমা, ওয়েব সিরিজের নিরপেক্ষ রিভিউ, গল্পের বিশ্লেষণ ও দেখার আগে জানার মতো তথ্য পড়ুন বিজকোঠায়।',
        intro: 'কোন সিনেমা বা সিরিজ দেখবেন, তা ঠিক করতে সাহায্য করবে আমাদের রিভিউ। গল্প, অভিনয় ও নির্মাণ নিয়ে নিরপেক্ষ মতামত পাবেন সহজ বাংলায়।',
      },
      en: {
        h1: 'Movie and Series Reviews',
        title: 'Honest Movie and Web Series Reviews',
        description: 'Honest reviews and story analysis of new and popular films and web series, in the Movie Review section of Bizkotha.',
        intro: 'Not sure what to watch next? Our reviews cover story, performances and craft so you can decide before you press play.',
      },
    },
  },
  {
    slug: 'islamic', bn: 'ইসলামিক', en: 'Islamic', active: true,
    seo: {
      bn: {
        h1: 'ইসলামিক লেখা ও ইতিহাস',
        title: 'ইসলামিক লেখা, ইতিহাস ও দৈনন্দিন জীবন',
        description: 'ইসলামের ইতিহাস, শিক্ষা ও দৈনন্দিন জীবনের গুরুত্বপূর্ণ বিষয় নিয়ে তথ্যনির্ভর লেখা পড়ুন বিজকোঠার ইসলামিক বিভাগে।',
        intro: 'ইসলামের ইতিহাস, শিক্ষা ও জীবনের নানা বিষয়ে তথ্যনির্ভর লেখা। প্রতিটি লেখা নির্ভরযোগ্য সূত্র ব্যবহার করে সহজ ভাষায় উপস্থাপন করা হয়।',
      },
      en: {
        h1: 'Islamic Articles and History',
        title: 'Islamic Articles, History and Everyday Life',
        description: 'Articles on Islamic history, teachings and everyday life, written in clear English, in the Islamic section of Bizkotha.',
        intro: 'Well-sourced articles on Islamic history, teachings and daily life, written in clear and simple English.',
      },
    },
  },
];

export const ACTIVE_CATEGORIES = CATEGORIES.filter((c) => c.active);

export function getActiveCategory(slug) {
  return ACTIVE_CATEGORIES.find((c) => c.slug === slug) || null;
}

export function categoryLabel(category, locale) {
  return locale === 'bn' ? category.bn : category.en;
}
