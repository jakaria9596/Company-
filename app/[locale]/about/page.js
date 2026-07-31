import { getDictionary } from '../../../lib/dictionary';

export async function generateMetadata({ params: { locale } }) {
  const dict = getDictionary(locale);
  return { title: dict.nav.about };
}

export default function AboutPage({ params: { locale } }) {
  const dict = getDictionary(locale);
  return (
    <div>
      <h1 className="font-display-en text-3xl font-black text-ink mb-6 pb-4 rule-double">
        {dict.nav.about}
      </h1>
      <p className="text-ink-soft leading-relaxed">
        {locale === 'bn'
          ? 'আমরা বিশ্বের বড় বড় কোম্পানির প্রতিষ্ঠার গল্প, সংগ্রাম আর সাফল্যের ইতিহাস তুলে ধরি — একটি মহাফেজখানার মতো, প্রতিটি কোম্পানির নিজস্ব ফাইল।'
          : 'We document the founding stories, struggles, and rise of the world\u2019s biggest companies — each one filed like its own case in a growing archive.'}
      </p>
    </div>
  );
}
