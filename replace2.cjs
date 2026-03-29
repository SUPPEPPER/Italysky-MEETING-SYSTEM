const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/text-slate-800/g, 'text-slate-200');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Replacements done.');
