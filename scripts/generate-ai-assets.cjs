const fs = require('fs');
const path = require('path');
const registry = require('../public/assets/registry.json');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function generateSVG(prompt, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{
              text: `Generate a premium SVG (800x600 viewBox) for: ${prompt}
                     
Requirements:
- Use exact viewBox="0 0 800 600"
- Premium quality, scalable vector graphics
- Use gradients, rich colors, proper SVG elements
- NO external dependencies (no external images, fonts)
- Output ONLY valid SVG code, no markdown, no explanation
- Use <defs> for gradients and filters
- Make it look professional and print-ready`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
          }
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gemini API error (${res.status}): ${errText}`);
      }

      const data = await res.json();
      let svg = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Clean Gemini response — extract SVG from markdown if needed
      svg = svg.replace(/```svg|```html|```/g, '').trim();
      
      // Validate it's actually SVG
      if (!svg.startsWith('<svg')) {
        const match = svg.match(/<svg[\s\S]*?<\/svg>/);
        if (match) {
            svg = match[0];
        } else {
            throw new Error('Response is not valid SVG');
        }
      }

      return svg;

    } catch (error) {
      console.error(`  ⚠️ Attempt ${attempt}/${retries} failed: ${error.message}`);
      if (attempt === retries) {
        // Fallback: simple but valid SVG
        const colors = ['#7C6EFA', '#C084FC', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#F472B6'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const name = prompt.split(',')[0].substring(0, 25);
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:${color};stop-opacity:0.3" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)" rx="20"/>
  <circle cx="400" cy="300" r="150" fill="${color}" opacity="0.08"/>
  <circle cx="400" cy="300" r="100" fill="${color}" opacity="0.12"/>
  <text x="400" y="310" font-family="system-ui" font-size="32" font-weight="bold" fill="${color}" text-anchor="middle" opacity="0.6">${name}</text>
</svg>`;
      }
      await new Promise(r => setTimeout(r, 2000)); // Wait before retry
    }
  }
}

async function run() {
    let totalAssets = 0;
    for (const [category, items] of Object.entries(registry.assets)) {
        console.log(`\n📁 Generating ${category} (${items.length} assets)...`);
        for (const item of items) {
            const prompt = `${item.name}, ${item.tags.join(', ')}, Category: ${category}`;
            
            const p = path.join(__dirname, '..', 'public', item.path);
            
            if (!fs.existsSync(path.dirname(p))) {
               fs.mkdirSync(path.dirname(p), { recursive: true });
            }
            
            if (fs.existsSync(p)) {
               console.log(`  ⏭️ Skipping ${item.name} (Already exists)`);
               continue;
            }

            try {
                const svg = await generateSVG(prompt);
                fs.writeFileSync(p, svg);
                console.log(`  ✅ ${item.name} generated`);
            } catch(e) {
                console.error(`  ❌ ${item.name} error: ${e.message}`);
            }
            
            totalAssets++;
        }
    }
    console.log(`\n📊 Registry checked. Done generation.`);
}

run();
