import { getAllArticles } from '../../lib/sheets';
import { getDictionary } from '../../lib/dictionary';
import ArticleCard from '../../components/ArticleCard';

export const revalidate = 300;

export default async function HomePage({ params: { locale } }) {
  const dict = getDictionary(locale);
  let articles = [];
  try {
    articles = await getAllArticles(locale);
  } catch (e) {}

  return (
    <div>
      <section className="mb-12 pb-8 rule-double">
        <div className="stamp mb-4">{locale === 'bn' ? 'সংরক্ষিত মহাফেজখানা' : 'Est. Archive'}</div>
        <h1 className="font-display-en text-4xl md:text-5xl font-black text-ink leading-tight">
          {dict.tagline}
        </h1>
      </section>

      <h2 className="font-mono text-xs uppercase tracking-widest text-brass mb-4">
        {locale === 'bn' ? 'সাম্প্রতিক ফাইল' : 'Recent Files'}
      </h2>

      {articles.length === 0 ? (
        <p className="text-ink-soft text-sm">
          {locale === 'bn'
            ? 'এখনো কোনো ফাইল যুক্ত হয়নি। Google Sheet সংযোগ করে প্রথম আর্টিকেল যোগ করুন।'
            : 'No files yet — connect your Google Sheet to publish the first story.'}
        </p>
      ) : (
        articles.slice(0, 10).map((a, i) => (
          <ArticleCard key={a.slug} article={a} locale={locale} dict={dict} index={i} />
        ))
      )}
    </div>
  );
}
