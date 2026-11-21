export default function ContentStatus({ loading, error, empty }) {
  if (!loading && !error && !empty) return null;
  return <p className="my-8 rounded-xl bg-[var(--color-surface-muted)] p-6 text-[var(--color-muted)]" role={error ? 'alert' : 'status'}>{loading ? 'Loading…' : error || 'Published content will appear here soon.'}</p>;
}
