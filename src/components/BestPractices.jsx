import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export default function BestPractices({ checks }) {
  const items = [
    { key: 'noSelectStar', label: 'Avoid SELECT * — project only needed columns' },
    { key: 'hasWhereOrLimit', label: 'Use WHERE and/or LIMIT to reduce scanned rows for exploratory queries' },
    { key: 'noCartesian', label: 'Avoid comma joins that risk Cartesian products' },
    { key: 'noLeadingWildcard', label: "Avoid leading wildcard in LIKE ('%term')" },
    { key: 'noOrderByRand', label: 'Avoid ORDER BY RAND() on large datasets' },
    { key: 'noFuncInWhere', label: 'Avoid wrapping indexed columns with functions in WHERE' },
    { key: 'parameterize', label: 'Use parameterized queries instead of string interpolation' },
  ];

  const status = (key) => checks?.[key] ?? false;

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-4 sm:px-5 py-3 border-b bg-slate-50">
        <h2 className="text-sm font-medium text-slate-700">Best Practices Checklist</h2>
      </div>
      <div className="p-4 sm:p-5">
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.key} className="flex items-start gap-3">
              {status(item.key) ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
              )}
              <span className="text-sm text-slate-700">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
