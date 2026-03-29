const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/bg-slate-800\/40\/5/g, 'bg-white/5');
content = content.replace(/bg-slate-800\/40-80/g, 'bg-slate-800/80');
content = content.replace(/bg-slate-800\/40-5/g, 'bg-slate-800/50');
content = content.replace(/border-white-10/g, 'border-white/10');
content = content.replace(/bg-slate-800-10/g, 'bg-slate-800/10');
content = content.replace(/ring-slate-800-10/g, 'ring-slate-800/10');
content = content.replace(/ring-brand-blue-20/g, 'ring-brand-blue/20');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Replacements done.');
