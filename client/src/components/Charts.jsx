import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  FiPieChart,
  FiTrendingUp,
  FiArrowUpRight,
} from 'react-icons/fi';
import { inr } from '../utils/format.js';

const COLORS = [
  '#0f766e',
  '#f59e0b',
  '#3b82f6',
  '#ef4444',
  '#8b5cf6',
  '#64748b',
];

export function categoryTotals(entries = []) {
  const map = {};

  entries
    .filter((entry) => entry.type === 'debit' && !entry.voided)
    .forEach((entry) => {
      map[entry.category] =
        (map[entry.category] || 0) + Number(entry.amount || 0);
    });

  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

const CustomTooltip = ({ active, payload, total }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0];
  const percentage = total > 0 ? (item.value / total) * 100 : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
      <div className="mb-1 flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: item.payload.fill }}
        />
        <span className="text-sm font-semibold text-slate-800">
          {item.name}
        </span>
      </div>

      <p className="text-lg font-bold text-slate-950">
        {inr(item.value)}
      </p>

      <p className="text-xs text-slate-500">
        {percentage.toFixed(1)}% of total spending
      </p>
    </div>
  );
};

export default function Charts({ entries = [] }) {
  const data = categoryTotals(entries);
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const topCategory = data[0];

  if (!data.length || total <= 0) {
    return (
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
            <FiPieChart size={21} />
          </div>

          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              Spending by category
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Understand where your money goes.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-10 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
            <FiPieChart size={25} />
          </div>

          <p className="font-semibold text-slate-800">
            No spending data yet
          </p>
          <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
            Add your first expense to see a visual breakdown of your spending.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
            <FiPieChart size={21} />
          </div>

          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              Spending by category
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              A breakdown of your expenses
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
          <FiTrendingUp size={14} />
          {data.length} {data.length === 1 ? 'category' : 'categories'}
        </span>
      </div>

      {/* Total */}
      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Total expenses
        </p>

        <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
          <p className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {inr(total)}
          </p>

          {topCategory && (
            <div className="text-right">
              <p className="text-xs text-slate-500">Top category</p>
              <p className="mt-0.5 flex items-center justify-end gap-1 text-sm font-semibold text-slate-800">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor:
                      COLORS[data.indexOf(topCategory) % COLORS.length],
                  }}
                />
                <span className="max-w-28 truncate">{topCategory.name}</span>
                <FiArrowUpRight size={14} className="text-teal-600" />
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Donut chart */}
      <div className="relative mt-4 h-64 w-full min-w-0 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="62%"
              outerRadius="84%"
              paddingAngle={3}
              cornerRadius={5}
              stroke="none"
              isAnimationActive
            >
              {data.map((item, index) => (
                <Cell
                  key={item.name}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              content={<CustomTooltip total={total} />}
              cursor={false}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-medium text-slate-500">
            Total spent
          </span>
          <span className="mt-1 max-w-[65%] truncate text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            {inr(total)}
          </span>
          <span className="mt-1 text-xs text-slate-400">
            {data.length} {data.length === 1 ? 'category' : 'categories'}
          </span>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="mt-3">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">
            Category breakdown
          </h3>
          <span className="text-xs text-slate-400">Share of expenses</span>
        </div>

        <ul className="space-y-3">
          {data.map((category, index) => {
            const percentage = (category.value / total) * 100;
            const color = COLORS[index % COLORS.length];

            return (
              <li key={category.name} className="group">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className="h-3 w-3 shrink-0 rounded-[4px]"
                      style={{ backgroundColor: color }}
                    />

                    <span className="truncate text-sm font-medium text-slate-700">
                      {category.name}
                    </span>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="text-sm font-bold text-slate-900">
                      {inr(category.value)}
                    </span>
                    <span className="ml-2 text-xs tabular-nums text-slate-500">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}