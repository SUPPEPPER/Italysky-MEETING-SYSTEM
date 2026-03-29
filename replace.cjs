const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  { from: /bg-slate-50/g, to: 'bg-slate-950/50' },
  { from: /bg-white/g, to: 'bg-slate-800/40' },
  { from: /text-slate-900/g, to: 'text-slate-100' },
  { from: /text-slate-700/g, to: 'text-slate-300' },
  { from: /text-slate-600/g, to: 'text-slate-400' },
  { from: /text-slate-500/g, to: 'text-slate-400' },
  { from: /border-slate-200/g, to: 'border-white/10' },
  { from: /border-slate-100/g, to: 'border-white/5' },
  { from: /bg-slate-100/g, to: 'bg-slate-800/80' },
  { from: /bg-slate-200/g, to: 'bg-slate-700' },
  { from: /bg-red-50/g, to: 'bg-brand-red/10' },
  { from: /text-red-600/g, to: 'text-brand-red' },
  { from: /hover:bg-red-100/g, to: 'hover:bg-brand-red/20' },
  { from: /bg-green-600/g, to: 'bg-brand-green' },
  { from: /hover:bg-green-700/g, to: 'hover:bg-brand-green/80' },
  { from: /text-white/g, to: 'text-slate-100' },
  { from: /text-red-500/g, to: 'text-brand-red' },
  { from: /bg-red-600/g, to: 'bg-brand-red' },
  { from: /hover:bg-red-700/g, to: 'hover:bg-brand-red/80' },
  { from: /bg-blue-600/g, to: 'bg-brand-blue' },
  { from: /hover:bg-blue-600/g, to: 'hover:bg-brand-blue/80' },
  { from: /shadow-sm/g, to: 'shadow-lg shadow-black/20' },
  { from: /shadow-xl/g, to: 'shadow-2xl shadow-brand-blue/10' },
];

replacements.forEach(({ from, to }) => {
  content = content.replace(from, to);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Replacements done.');
