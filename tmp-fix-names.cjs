const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');

const match = indexHtml.match(/const TOOLS_DATABASE = (\[[\s\S]*?\]);/);
if (match) {
  let db = eval(match[1]);
  db = db.map(tool => {
    let n = tool.name;
    n = n.replace(/How to Create /i, '')
         .replace(/Generate /i, '')
         .replace(/Free /i, '')
         .replace(/ Generator/i, '')
         .replace(/ Online/i, '')
         .replace(/ QR Code/i, '')
         .replace(/ QR/i, '');
    n = n.replace(/ For .*/i, '');
    n = n.replace(/ - .*/, '');
    n = n.trim();
    return { name: n, cat: tool.cat, path: tool.path };
  });

  let newDbStr = "const TOOLS_DATABASE = [\n" + db.map(t => `  { name: ${JSON.stringify(t.name)}, cat: ${JSON.stringify(t.cat)}, path: ${JSON.stringify(t.path)} }`).join(',\n') + "\n];";
  indexHtml = indexHtml.replace(/const TOOLS_DATABASE = \[[\s\S]*?\];/, newDbStr);
  fs.writeFileSync('index.html', indexHtml);
  console.log('Fixed names in index.html');
}
