export default function Footer({ dict }) {
  return (
    <footer className="border-t-2 border-ink/80 mt-16">
      <div className="max-w-3xl mx-auto px-5 py-8 flex flex-col md:flex-row justify-between gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-soft">
        <span>{dict.footerNote}</span>
        <span>&copy; {new Date().getFullYear()} {dict.siteName}</span>
      </div>
    </footer>
  );
}
