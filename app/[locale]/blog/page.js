import { getAllArticles } from '../../../lib/sheets';
import { getDictionary } from '../../../lib/dictionary';
import ArticleCard from '../../../components/ArticleCard';

export const revalidate = 300;

export async function generateMetadata({ params: { locale } }) {
  const dict = getDictionary(locale);
  return { title: dict.nav.blog };
}

export default async function BlogIndexPage({ params: { locale } }) {
  const dict = getDictionary(locale);
  let articles = [];
  try {
    articles = await getAllArticles(locale);
  } catch (e) {}

  return (
    <div>
      <h1 className="font-display-en text-3xl font-black text-ink mb-8 pb-4 rule-double">
        {dict.nav.blog}
      </h1>
      {articles.map((a, i) => (
        <ArticleCard key={a.slug} article={a} locale={locale} dict={dict} index={i} />
      ))}
    </div>
  );
}
