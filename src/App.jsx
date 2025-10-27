import React, { useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import SQLEditor from './components/SQLEditor.jsx';
import OptimizationResults from './components/OptimizationResults.jsx';
import BestPractices from './components/BestPractices.jsx';

function upperKeywords(sql) {
  if (!sql) return '';
  const keywords = [
    'select','from','where','join','inner','left','right','full','outer','on','and','or','group by','order by','limit','offset','having','union','distinct','insert','into','values','update','set','delete','create','table','as','in','exists','like','not','between','case','when','then','else','end'
  ];
  let out = sql;
  // Handle multi-word keywords first
  const multi = ['group by','order by'];
  multi.forEach(k => {
    const r = new RegExp(`\\b${k.replace(' ', '\\s+')}\\b`, 'gi');
    out = out.replace(r, k.toUpperCase());
  });
  // Single words
  keywords.filter(k => !multi.includes(k)).forEach(k => {
    const r = new RegExp(`\\b${k}\\b`, 'gi');
    out = out.replace(r, k.toUpperCase());
  });
  return out.trim();
}

function analyzeSql(sqlRaw) {
  const sql = (sqlRaw || '').trim();
  const lc = sql.toLowerCase();
  const results = [];

  const isSelect = /\bselect\b/.test(lc);
  const hasFrom = /\bfrom\b/.test(lc);
  const hasWhere = /\bwhere\b/.test(lc);
  const hasLimit = /\blimit\b/.test(lc);
  const selectStar = /\bselect\s*\*/i.test(lc);
  const commaJoin = /\bfrom\b[\s\S]*?,[\s\S]*?(\bwhere\b|$)/i.test(lc);
  const orderByRand = /order\s+by\s+rand\s*\(\s*\)/i.test(lc);
  const leadingWildcardLike = /like\s+['"]%/i.test(lc);
  const funcInWhere = /\bwhere\b[\s\S]*\b(lower|upper|date|substr|substring|trim|ltrim|rtrim)\s*\(/i.test(lc);
  const largeInList = /\bin\s*\((?:[^)]*,){10,}[^)]*\)/i.test(lc);
  const offsetNoLimit = /\boffset\b/.test(lc) && !hasLimit;

  if (!sql) {
    return { results: [], checks: {}, formatted: '' };
  }

  if (isSelect && selectStar) {
    results.push({
      severity: 'warn',
      title: 'SELECT * detected',
      detail: 'Project only required columns to reduce I/O and improve index-only scans.',
      example: 'SELECT id, name, created_at\nFROM users\nWHERE id = ?;'
    });
  } else if (isSelect) {
    results.push({ severity: 'good', title: 'Explicit column projection', detail: 'Good job avoiding SELECT *.' });
  }

  if (isSelect && hasFrom && !hasWhere && !/\bcount\s*\(/i.test(lc)) {
    results.push({
      severity: 'info',
      title: 'No WHERE clause found',
      detail: 'Consider adding WHERE to filter rows or LIMIT for exploratory queries to avoid full scans.'
    });
  }

  if (commaJoin) {
    results.push({
      severity: 'warn',
      title: 'Comma join may cause a Cartesian product',
      detail: 'Prefer explicit JOIN ... ON syntax with proper join predicates.',
      example: 'SELECT ...\nFROM a\nJOIN b ON a.id = b.a_id;'
    });
  }

  if (orderByRand) {
    results.push({
      severity: 'warn',
      title: 'ORDER BY RAND() is costly on large datasets',
      detail: 'Consider precomputing random keys, using TABLESAMPLE, or ordering by a pre-generated random column with an index.'
    });
  }

  if (leadingWildcardLike) {
    results.push({
      severity: 'warn',
      title: "Leading wildcard in LIKE prevents index usage",
      detail: "Use full-text search, trigram indexes, or search without leading '%' if possible."
    });
  }

  if (funcInWhere) {
    results.push({
      severity: 'info',
      title: 'Function call in WHERE may disable index',
      detail: 'Apply the function to the parameter instead of the column or use functional indexes.'
    });
  }

  if (largeInList) {
    results.push({
      severity: 'info',
      title: 'Large IN (...) list detected',
      detail: 'Consider using a temporary table join or table-valued parameter for better plans.'
    });
  }

  if (offsetNoLimit) {
    results.push({
      severity: 'info',
      title: 'OFFSET without LIMIT',
      detail: 'Use LIMIT with OFFSET or keyset pagination to avoid scanning unnecessary rows.'
    });
  }

  const checks = {
    noSelectStar: !selectStar,
    hasWhereOrLimit: hasWhere || hasLimit || !isSelect,
    noCartesian: !commaJoin,
    noLeadingWildcard: !leadingWildcardLike,
    noOrderByRand: !orderByRand,
    noFuncInWhere: !funcInWhere,
    parameterize: !/(=\s*['"]).+(['"])\s*(and|or|;|$)/i.test(lc),
  };

  const formatted = upperKeywords(sql);

  return { results, checks, formatted };
}

export default function App() {
  const [sql, setSql] = useState('');
  const [analysis, setAnalysis] = useState({ results: [], checks: {}, formatted: '' });

  const run = () => setAnalysis(analyzeSql(sql));
  const formatOnly = () => setAnalysis((prev) => ({ ...prev, formatted: upperKeywords(sql) }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SQLEditor sql={sql} setSql={setSql} onAnalyze={run} onFormat={formatOnly} />
          <OptimizationResults results={analysis.results} formattedSql={analysis.formatted} />
        </div>
        <BestPractices checks={analysis.checks} />
        {analysis.formatted && (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-4 sm:px-5 py-3 border-b bg-slate-50">
              <h2 className="text-sm font-medium text-slate-700">Formatted SQL</h2>
            </div>
            <div className="p-4 sm:p-5">
              <pre className="text-sm bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto"><code>{analysis.formatted}</code></pre>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
