export default function StatCard({ label, value, tone = 'text-slate-900' }) {
  return (
    <div className="card">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-lg font-semibold break-words ${tone}`}>{value}</p>
    </div>
  );
}
