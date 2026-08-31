interface Props {
  page: number;
  pages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, pages, onChange }: Props) {
  if (pages <= 1) return null;

  const nums: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pages, start + 4);
  for (let i = start; i <= end; i++) nums.push(i);

  const btn =
    'inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition';

  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5">
      <button
        className={`${btn} border border-slate-300 disabled:opacity-40 dark:border-slate-700`}
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
      >
        Prev
      </button>
      {nums.map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`${btn} ${
            n === page
              ? 'bg-brand-600 text-white'
              : 'border border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          {n}
        </button>
      ))}
      <button
        className={`${btn} border border-slate-300 disabled:opacity-40 dark:border-slate-700`}
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
      >
        Next
      </button>
    </nav>
  );
}
