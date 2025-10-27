import React, { useState, useEffect } from 'react';
import { Wand2, Trash2, Copy } from 'lucide-react';

export default function SQLEditor({ sql, setSql, onAnalyze, onFormat }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(t);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sql || '');
      setCopied(true);
    } catch {}
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b bg-slate-50">
        <h2 className="text-sm font-medium text-slate-700">Query Editor</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onFormat}
            className="text-xs px-3 py-1.5 rounded-md border bg-white hover:bg-slate-50 text-slate-700"
            aria-label="Format SQL"
          >
            Format
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="text-xs px-3 py-1.5 rounded-md border bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-2"
            aria-label="Copy SQL"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          placeholder="Paste or write a SQL query here..."
          className="w-full h-56 sm:h-64 font-mono text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/60 p-3 sm:p-4 resize-y"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={onAnalyze}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500/40"
          >
            <Wand2 className="w-4 h-4" />
            Analyze Query
          </button>
          <button
            onClick={() => setSql('')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white text-slate-700 border hover:bg-slate-50"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>
    </section>
  );
}
