const html=require('fs').readFileSync('index.html', 'utf8');
const match = html.match(/const TOOLS_DATABASE = (\[[\s\S]*?\]);/);
const db = eval(match[1]);
console.log(Array.from(new Set(db.map(t=>t.cat))));
console.log(db);
