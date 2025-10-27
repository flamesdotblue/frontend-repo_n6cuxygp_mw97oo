import React from 'react';
import { AlertTriangle, CheckCircle2, Copy } from 'lucide-react';

const severityStyles = {
  info: 'bg-sky-50 text-sky-800 border-sky-200',
  warn: 'bg-amber-50 text-amber-800 border-amber-200',
  error: 'bg-rose-50 text-rose-800 border-rose-200',
  good: 'bg-emerald-50 text-emerald-800 border-emerald-200',
};

export default function OptimizationResults({ results, formattedSql }) {
  const hasResults = results && results.length > 0;

  const copyOptimized = async () => {
    if (!formattedSql) return;
    try { await navigator.clipboard.writeText(formattedSql); } catch {}
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b bg-slate-50">
        <h2 className="text-sm font-medium text-slate-700">Optimization Insights</h2>
        {formattedSql && (
          <button onClick={copyOptimized} className="text-xs px-3 py-1.5 rounded-md border bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-2">
            <Copy className="w-3.5 h-3.5" /> Copy formatted SQL
          </button>
        )}
      </div>
      <div className="p-4 sm:p-5">
        {!hasResults && (
          <div className="text-slate-500 text-sm">Run an analysis to see opportunities and best-practice tips.</div>
        )}

        {hasResults && (
          <ul className="space-y-3">
            {results.map((r, idx) => (
              <li key={idx} className={`border rounded-lg p-3 sm:p-4 ${severityStyles[r.severity] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                <div className="flex items-start gap-3">
                  {r.severity === 'good' ? (
                    <CheckCircle2 className="mt-0.5 w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="mt-0.5 w-5 h-5 text-amber-600" />
                  )}
                  <div>
                    <p className="font-medium">{r.title}</p>
                    {r.detail && <p className="text-sm opacity-90 mt-1">{r.detail}</p>}
                    {r.example && (
                      <pre className="mt-3 text-xs bg-black/90 text-emerald-100 rounded-md p-3 overflow-x-auto"><code>{r.example}</code></pre>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
